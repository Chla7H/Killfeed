local KVP_KEY = "nizar_killfeed:settings"
local HEAD_BONE = 31086 -- SKEL_Head

local settings = nil        -- player's saved UI settings
local myServerId = 0
local streak = 0            -- current kill streak
local deathReported = false -- prevents reporting the same death twice
local nuiReady = false
local editorOpen = false

---------------------------------------------------------------------
-- Settings (defaults overlaid with the player's saved KVP)
---------------------------------------------------------------------

local function loadSettings()
    local loaded = {}
    for k, v in pairs(Config.Defaults) do
        loaded[k] = v
    end

    local raw = GetResourceKvpString(KVP_KEY)
    if raw then
        local ok, saved = pcall(json.decode, raw)
        if ok and type(saved) == "table" then
            for k, v in pairs(saved) do
                -- only accept known keys with the same value type as the default
                if loaded[k] ~= nil and type(v) == type(loaded[k]) then
                    loaded[k] = v
                end
            end
        end
    end

    loaded.maxEntries = math.min(loaded.maxEntries, Config.MaxEntries)
    return loaded
end

local function sendInit()
    if not settings then return end

    SendNUIMessage({
        type = "init",
        settings = settings,
        hardMax = Config.MaxEntries,
    })
end

CreateThread(function()
    settings = loadSettings()
    myServerId = GetPlayerServerId(PlayerId())
    Wait(1000)
    sendInit()
end)

---------------------------------------------------------------------
-- NUI callbacks
---------------------------------------------------------------------

RegisterNUICallback("ready", function(_, cb)
    nuiReady = true
    sendInit()
    cb({ ok = true })
end)

RegisterNUICallback("save", function(data, cb)
    if type(data) == "table" then
        for k, v in pairs(data) do
            if settings[k] ~= nil and type(v) == type(settings[k]) then
                settings[k] = v
            end
        end

        settings.maxEntries = math.min(settings.maxEntries, Config.MaxEntries)
        SetResourceKvp(KVP_KEY, json.encode(settings))
    end

    cb({ ok = true })
end)

RegisterNUICallback("close", function(_, cb)
    editorOpen = false
    SetNuiFocus(false, false)
    cb({ ok = true })
end)

---------------------------------------------------------------------
-- Editor
---------------------------------------------------------------------

local function openEditor()
    if editorOpen then return end

    editorOpen = true
    SetNuiFocus(true, true)
    SendNUIMessage({ type = "openEditor" })
end

RegisterNetEvent("Nizar-Killfeed:openEditor", openEditor)

-- Server decides whether the player may open the editor
RegisterCommand(Config.Command, function()
    TriggerServerEvent("Nizar-Killfeed:requestEditor")
end, false)

local function translate(key)
    local locale = Locales and (Locales[Config.Locale] or Locales.en)
    return (locale and locale[key]) or key
end

TriggerEvent("chat:addSuggestion", "/" .. Config.Command, translate("editor_suggestion"))

---------------------------------------------------------------------
-- Helpers
---------------------------------------------------------------------

-- Vehicle category the ped is in ("heli", "plane", "boat", "bike", "car") or nil on foot
local function getVehicleEnv(ped)
    if not ped or ped == 0 or not DoesEntityExist(ped) then
        return nil
    end

    local vehicle = GetVehiclePedIsIn(ped, false)
    if vehicle == 0 then
        return nil
    end

    local class = GetVehicleClass(vehicle)
    if class == 15 then return "heli" end
    if class == 16 then return "plane" end
    if class == 14 then return "boat" end
    if class == 8 or class == 13 then return "bike" end -- motorcycles / cycles
    return "car"
end

-- Resolves an entity (ped or vehicle) to the player ped + server id behind it.
-- Returns nil, nil when the attacker isn't a player.
local function resolveKiller(entity)
    if not entity or entity == 0 or not DoesEntityExist(entity) then
        return nil, nil
    end

    -- A vehicle counts as its driver
    if IsEntityAVehicle(entity) then
        local driver = GetPedInVehicleSeat(entity, -1)
        if driver ~= 0 then
            entity = driver
        end
    end

    if IsEntityAPed(entity) and IsPedAPlayer(entity) then
        local playerIndex = NetworkGetPlayerIndexFromPed(entity)
        if playerIndex and playerIndex ~= -1 then
            return entity, GetPlayerServerId(playerIndex)
        end
    end

    return nil, nil
end

-- Weapon categories where a headshot is meaningful
local gunCategories = {
    pistol = true,
    smg = true,
    rifle = true,
    sniper = true,
    shotgun = true,
    mg = true,
    stun = true,
}

-- Did our last shot land near the victim's head?
local function isHeadshotKill(victimPed, weaponHash)
    local weaponInfo = KF.WeaponInfo(weaponHash)
    if not gunCategories[weaponInfo.cat] then
        return false
    end

    local hit, impactCoords = GetPedLastWeaponImpactCoord(PlayerPedId())
    if not hit then
        return false
    end

    local headCoords = GetPedBoneCoords(victimPed, HEAD_BONE, 0.0, 0.0, 0.0)
    return #(impactCoords - headCoords) < 0.35
end

---------------------------------------------------------------------
-- Reporting kills/deaths to the server
---------------------------------------------------------------------

local function onLocalPlayerDeath(attacker, weaponHash)
    if deathReported then return end
    deathReported = true

    streak = 0
    SendNUIMessage({ type = "resetStreak" })

    local ped = PlayerPedId()

    local killerPed, killerId = resolveKiller(attacker)
    if not killerId then
        killerPed, killerId = resolveKiller(GetPedSourceOfDeath(ped))
    end

    if not weaponHash or weaponHash == 0 then
        weaponHash = GetPedCauseOfDeath(ped)
    end

    local _, lastBone = GetPedLastDamageBone(ped)
    local headshot = lastBone == HEAD_BONE

    local distance = 0
    if killerPed then
        distance = math.floor(#(GetEntityCoords(ped) - GetEntityCoords(killerPed)) + 0.5)
    end

    TriggerServerEvent("Nizar-Killfeed:death", {
        killer = killerId,
        weapon = weaponHash,
        headshot = headshot,
        distance = distance,
        kEnv = killerPed and getVehicleEnv(killerPed) or nil,
        vEnv = getVehicleEnv(ped),
    })
end

local function onNpcKill(npcPed, weaponHash)
    if not Config.ShowNPCKills then return end

    local ped = PlayerPedId()

    TriggerServerEvent("Nizar-Killfeed:npcKill", {
        weapon = weaponHash,
        headshot = isHeadshotKill(npcPed, weaponHash),
        distance = math.floor(#(GetEntityCoords(ped) - GetEntityCoords(npcPed)) + 0.5),
        kEnv = getVehicleEnv(ped),
        vEnv = getVehicleEnv(npcPed),
        animal = GetPedType(npcPed) == 28,
    })
end

AddEventHandler("gameEventTriggered", function(name, args)
    if name ~= "CEventNetworkEntityDamage" then return end

    local victim = args[1]
    local attacker = args[2]
    local fatal = args[6] == 1
    local weaponHash = args[7]

    if not fatal then return end

    local playerPed = PlayerPedId()

    if victim == playerPed then
        onLocalPlayerDeath(attacker, weaponHash)

    elseif victim ~= 0 and IsEntityAPed(victim) and not IsPedAPlayer(victim) then
        -- NPC/animal killed by us or by the vehicle we're in
        local vehicle = GetVehiclePedIsIn(playerPed, false)
        if attacker == playerPed or (vehicle ~= 0 and attacker == vehicle) then
            onNpcKill(victim, weaponHash)
        end
    end
end)

-- Allow a new death report once the player has respawned
CreateThread(function()
    while true do
        Wait(1000)

        if deathReported and not IsEntityDead(PlayerPedId()) then
            deathReported = false
        end
    end
end)

---------------------------------------------------------------------
-- Incoming kill from the server -> NUI
---------------------------------------------------------------------

RegisterNetEvent("Nizar-Killfeed:kill", function(data)
    if type(data) ~= "table" then return end

    if data.killer and data.killer.id == myServerId then
        streak = streak + 1
        data.streak = streak
        data.mine = true
    end

    if data.victim and data.victim.id == myServerId then
        data.victimMine = true
    end

    local weaponInfo = KF.WeaponInfo(data.weapon)
    data.cat = data.animal and "animal" or weaponInfo.cat
    data.label = weaponInfo.label
    data.wkey = weaponInfo.key

    SendNUIMessage({ type = "kill", data = data })
end)

---------------------------------------------------------------------
-- Public client API (KF.Client)
---------------------------------------------------------------------

KF.Client = {}

-- Copy of the current settings
function KF.Client.GetSettings()
    local copy = {}
    if settings then
        for k, v in pairs(settings) do
            copy[k] = v
        end
    end
    return copy
end

function KF.Client.OpenEditor()
    openEditor()
end

function KF.Client.ShowBlood(amount)
    SendNUIMessage({ type = "blood", amount = tonumber(amount) or 15 })
end

function KF.Client.PlayKillEffect(id, headshot)
    SendNUIMessage({ type = "playfx", id = tonumber(id), hs = headshot == true })
end

-- Validates and displays a kill entry; returns true on success
function KF.Client.PushKill(data)
    if type(data) ~= "table" or type(data.victim) ~= "table" then
        return false
    end

    local weapon = data.weapon
    if type(weapon) == "string" then
        weapon = joaat(weapon)
    end

    local weaponInfo = KF.WeaponInfo(weapon)

    local entry = {
        killer = type(data.killer) == "table" and {
            id = tonumber(data.killer.id) or 0,
            cid = tonumber(data.killer.cid),
            name = tostring(data.killer.name or "Unknown"),
        } or nil,

        victim = {
            id = tonumber(data.victim.id) or 0,
            cid = tonumber(data.victim.cid),
            name = tostring(data.victim.name or "Unknown"),
        },

        headshot = data.headshot == true,
        distance = math.floor(tonumber(data.distance) or 0),
        kEnv = type(data.kEnv) == "string" and data.kEnv or nil,
        vEnv = type(data.vEnv) == "string" and data.vEnv or nil,
        suicide = data.killer == nil,
        npc = data.npc == true,
        mine = data.mine == true,
        cat = type(data.cat) == "string" and data.cat or weaponInfo.cat,
        wkey = type(data.wkey) == "string" and data.wkey or weaponInfo.key,
        label = weaponInfo.label,
    }

    if entry.mine then
        streak = streak + 1
        entry.streak = tonumber(data.streak) or streak
    end

    SendNUIMessage({ type = "kill", data = entry })
    return true
end

RegisterNetEvent("Nizar-Killfeed:playFx", function(id, headshot)
    KF.Client.PlayKillEffect(id, headshot)
end)

RegisterNetEvent("Nizar-Killfeed:bloodFx", function(amount)
    KF.Client.ShowBlood(amount)
end)

---------------------------------------------------------------------
-- Blood overlay: trigger when health + armour drop
---------------------------------------------------------------------

CreateThread(function()
    local ped = PlayerPedId()
    local lastTotal = GetEntityHealth(ped) + GetPedArmour(ped)

    while true do
        Wait(150)

        ped = PlayerPedId()
        local total = GetEntityHealth(ped) + GetPedArmour(ped)

        if lastTotal > total and settings and settings.blood then
            local damage = lastTotal - total
            if damage >= 3 then
                SendNUIMessage({ type = "blood", amount = damage })
            end
        end

        lastTotal = total
    end
end)
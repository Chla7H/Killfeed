

-- ══════════════════════════════════════════════════════════════
--  NIZAR KILLFEED · PUBLIC CLIENT EXPORTS
--  Full documentation + examples in README.md
-- ══════════════════════════════════════════════════════════════

--- Push a fully custom kill entry to this client's feed.
--- exports['Nizar-Killfeed']:PushKill({
---     killer = { id = 12, name = 'Wolf' },
---     victim = { id = 31, name = 'Sheep' },
---     weapon = 'WEAPON_CARBINERIFLE',
---     headshot = true, distance = 143,
---     kEnv = 'car', mine = true,
--- })
exports('PushKill', function(data)
    return KF.Client.PushKill(data)
end)

--- Play a full-screen kill effect on this client.
--- effectId: 1=Pulse 2=Skull Pop 3=Blade Slash 4=Shockwave 5=Glitch
---           (nil = the player's own selected effect)
--- exports['Nizar-Killfeed']:PlayKillEffect(2, true)
exports('PlayKillEffect', function(effectId, headshot)
    return KF.Client.PlayKillEffect(effectId, headshot)
end)

--- Play the blood splatter overlay (amount ~ damage, 3..100).
--- exports['Nizar-Killfeed']:ShowBlood(35)
exports('ShowBlood', function(amount)
    return KF.Client.ShowBlood(amount)
end)

--- Open the killfeed customizer UI.
exports('OpenEditor', function()
    return KF.Client.OpenEditor()
end)

--- Get a copy of the local player's killfeed settings table.
exports('GetSettings', function()
    return KF.Client.GetSettings()
end)



-- ══════════════════════════════════════════════════════════════
--  TEST COMMAND  (/killfeedtest [count])
--  Fake kills, only on your own screen. See Config.TestCommand.
-- ══════════════════════════════════════════════════════════════
if Config.TestCommand then
    local testWeapons = {
        'WEAPON_CARBINERIFLE', 'WEAPON_PISTOL', 'WEAPON_KNIFE', 'WEAPON_PUMPSHOTGUN',
        'WEAPON_SMG', 'WEAPON_HEAVYSNIPER', 'WEAPON_ASSAULTRIFLE', 'WEAPON_MICROSMG',
        'WEAPON_BAT', 'WEAPON_RPG', 'WEAPON_COMBATPISTOL', 'WEAPON_MG',
    }
    local testNames = { 'Wolf', 'Viper', 'Ghost', 'Titan', 'Raven', 'Echo', 'Storm', 'Nyx', 'Rex', 'Frost', 'Hawk', 'Dodo' }
    local testEnv = { '', '', '', 'car', 'bike', 'heli', 'plane', 'boat' }
    local testing = false

    local function pick(list) return list[math.random(1, #list)] end

    RegisterCommand(Config.TestCommand, function(_, args)
        if testing then return end
        if Config.TestAce and not IsPlayerAceAllowed(PlayerId(), Config.TestAce) then return end
        local count = math.min(math.max(tonumber(args[1]) or 5, 1), 15)
        testing = true
        CreateThread(function()
            local me = GetPlayerServerId(PlayerId())
            for i = 1, count do
                local mine = (i % 2 == 1)           -- alternate: your kill / someone else's kill
                local hs = math.random(1, 3) == 1
                local victimName = pick(testNames)
                local killerName = pick(testNames)
                if killerName == victimName then killerName = 'Wolf' end
                local data = {
                    killer = { id = mine and me or math.random(2, 120), name = mine and GetPlayerName(PlayerId()) or killerName },
                    victim = { id = math.random(2, 120), name = victimName },
                    weapon = pick(testWeapons),
                    headshot = hs,
                    distance = math.random(3, 280),
                    kEnv = (function() local e = pick(testEnv); return e ~= '' and e or nil end)(),
                    mine = mine,
                }
                -- every ~7th entry is a suicide
                if i % 7 == 0 then data.killer = nil; data.mine = false end
                KF.Client.PushKill(data)
                if mine then KF.Client.PlayKillEffect(nil, hs) end
                Wait(900)
            end
            testing = false
        end)
    end, false)

    TriggerEvent('chat:addSuggestion', '/' .. Config.TestCommand, 'Fire fake kills on your screen to test the killfeed',
        { { name = 'count', help = '1-15 (default 5)' } })
end

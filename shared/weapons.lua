KF = KF or {}

-- Weapon names grouped by category
local weaponCategories = {
    pistol = {
        "WEAPON_PISTOL", "WEAPON_PISTOL_MK2", "WEAPON_COMBATPISTOL", "WEAPON_APPISTOL",
        "WEAPON_PISTOL50", "WEAPON_SNSPISTOL", "WEAPON_SNSPISTOL_MK2", "WEAPON_HEAVYPISTOL",
        "WEAPON_VINTAGEPISTOL", "WEAPON_MARKSMANPISTOL", "WEAPON_REVOLVER", "WEAPON_REVOLVER_MK2",
        "WEAPON_DOUBLEACTION", "WEAPON_RAYPISTOL", "WEAPON_CERAMICPISTOL", "WEAPON_NAVYREVOLVER",
        "WEAPON_GADGETPISTOL", "WEAPON_PISTOLXM3", "WEAPON_FLAREGUN",
    },
    smg = {
        "WEAPON_MICROSMG", "WEAPON_SMG", "WEAPON_SMG_MK2", "WEAPON_ASSAULTSMG",
        "WEAPON_COMBATPDW", "WEAPON_MACHINEPISTOL", "WEAPON_MINISMG", "WEAPON_TECPISTOL",
    },
    shotgun = {
        "WEAPON_PUMPSHOTGUN", "WEAPON_PUMPSHOTGUN_MK2", "WEAPON_SAWNOFFSHOTGUN", "WEAPON_ASSAULTSHOTGUN",
        "WEAPON_BULLPUPSHOTGUN", "WEAPON_MUSKET", "WEAPON_HEAVYSHOTGUN", "WEAPON_DBSHOTGUN",
        "WEAPON_AUTOSHOTGUN", "WEAPON_COMBATSHOTGUN",
    },
    rifle = {
        "WEAPON_ASSAULTRIFLE", "WEAPON_ASSAULTRIFLE_MK2", "WEAPON_CARBINERIFLE", "WEAPON_CARBINERIFLE_MK2",
        "WEAPON_ADVANCEDRIFLE", "WEAPON_SPECIALCARBINE", "WEAPON_SPECIALCARBINE_MK2", "WEAPON_BULLPUPRIFLE",
        "WEAPON_BULLPUPRIFLE_MK2", "WEAPON_COMPACTRIFLE", "WEAPON_MILITARYRIFLE", "WEAPON_HEAVYRIFLE",
        "WEAPON_TACTICALRIFLE", "WEAPON_SERVICECARBINE", "WEAPON_BATTLERIFLE",
    },
    mg = {
        "WEAPON_MG", "WEAPON_COMBATMG", "WEAPON_COMBATMG_MK2", "WEAPON_GUSENBERG", "WEAPON_RAYCARBINE",
    },
    sniper = {
        "WEAPON_SNIPERRIFLE", "WEAPON_HEAVYSNIPER", "WEAPON_HEAVYSNIPER_MK2",
        "WEAPON_MARKSMANRIFLE", "WEAPON_MARKSMANRIFLE_MK2", "WEAPON_PRECISIONRIFLE",
    },
    heavy = {
        "WEAPON_RPG", "WEAPON_GRENADELAUNCHER", "WEAPON_GRENADELAUNCHER_SMOKE", "WEAPON_MINIGUN",
        "WEAPON_FIREWORK", "WEAPON_RAILGUN", "WEAPON_RAILGUNXM3", "WEAPON_HOMINGLAUNCHER",
        "WEAPON_COMPACTLAUNCHER", "WEAPON_EMPLAUNCHER", "WEAPON_PASSENGER_ROCKET",
        "WEAPON_AIRSTRIKE_ROCKET", "WEAPON_STINGER", "WEAPON_VEHICLE_ROCKET", "WEAPON_ROCKET",
    },
    melee = {
        "WEAPON_KNIFE", "WEAPON_NIGHTSTICK", "WEAPON_HAMMER", "WEAPON_BAT", "WEAPON_GOLFCLUB",
        "WEAPON_CROWBAR", "WEAPON_BOTTLE", "WEAPON_DAGGER", "WEAPON_HATCHET", "WEAPON_MACHETE",
        "WEAPON_FLASHLIGHT", "WEAPON_SWITCHBLADE", "WEAPON_POOLCUE", "WEAPON_WRENCH",
        "WEAPON_BATTLEAXE", "WEAPON_STONE_HATCHET", "WEAPON_CANDYCANE", "WEAPON_KNUCKLE",
    },
    unarmed = {
        "WEAPON_UNARMED",
    },
    throwable = {
        "WEAPON_GRENADE", "WEAPON_STICKYBOMB", "WEAPON_PROXMINE", "WEAPON_PIPEBOMB", "WEAPON_BZGAS",
        "WEAPON_SMOKEGRENADE", "WEAPON_SNOWBALL", "WEAPON_BALL", "WEAPON_EXPLOSION",
    },
    fire = {
        "WEAPON_MOLOTOV", "WEAPON_PETROLCAN", "WEAPON_FIRE", "WEAPON_HAZARDCAN",
        "WEAPON_FERTILIZERCAN", "WEAPON_FLARE",
    },
    stun = {
        "WEAPON_STUNGUN", "WEAPON_STUNGUN_MP", "WEAPON_STUNROD",
    },
    vehicle = {
        "WEAPON_RAMMED_BY_CAR", "WEAPON_RUN_OVER_BY_CAR", "WEAPON_HELI_CRASH",
    },
    fall = {
        "WEAPON_FALL",
    },
    drown = {
        "WEAPON_DROWNING", "WEAPON_DROWNING_IN_VEHICLE",
    },
    other = {
        "WEAPON_ELECTRIC_FENCE", "WEAPON_BARBED_WIRE", "WEAPON_EXHAUSTION", "WEAPON_BLEEDING",
    },
    animal = {
        "WEAPON_ANIMAL", "WEAPON_COUGAR",
    },
}

-- "WEAPON_PISTOL_MK2" -> "Pistol Mk2"
local function makeLabel(weaponName)
    local text = weaponName:gsub("^WEAPON_", ""):gsub("_", " "):lower()

    return (text:gsub("(%a)([%w]*)", function(first, rest)
        return first:upper() .. rest
    end))
end

-- Lookup by weapon hash -> { cat, label, key }
local weaponsByHash = {}

for category, names in pairs(weaponCategories) do
    for _, weaponName in ipairs(names) do
        weaponsByHash[joaat(weaponName)] = {
            cat = category,
            label = makeLabel(weaponName),
            key = weaponName:gsub("^WEAPON_", ""):lower(),
        }
    end
end

-- Returns { cat, label, key } for a weapon hash.
-- Unknown or missing weapons come back as { cat = "other", label = "Unknown" }.
function KF.WeaponInfo(weaponHash)
    if not weaponHash then
        return { cat = "other", label = "Unknown" }
    end

    return weaponsByHash[weaponHash] or { cat = "other", label = "Unknown" }
end
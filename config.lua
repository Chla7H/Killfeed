

Config = {}

-- ══════════════════════════════════════════════════════════════
--  NIZAR KILLFEED · CONFIG
--  Everything visual is customizable IN-GAME through /killfeed
--  (per-player, saved in KVP). This file only holds server-side
--  behaviour + the defaults a player starts with.
-- ══════════════════════════════════════════════════════════════

-- Locale for the few Lua-side strings (locales/*.lua): 'en', 'pt', 'es', 'fr'
-- The editor UI itself is English.
Config.Locale = 'en'

-- Command that opens the in-game editor
Config.Command = 'killfeed'

-- Test command: fires fake kills on YOUR screen only (nothing is sent to other players).
--   /killfeedtest [count]   e.g. /killfeedtest 6   (default 5, max 15)
-- Set to false to disable it.
Config.TestCommand = 'killfeedtest'
Config.TestAce = false   -- or an ace like 'Nizar.killfeed' to restrict who can use it

-- Restrict the editor to players with the ace permission below.
-- false = every player can customize their own killfeed (recommended)
Config.RestrictEditor = false
Config.EditorAce = 'Nizar.killfeed'

-- Who receives kill entries:
--   'global' = everyone on the server
--   'radius' = only players within Config.FeedRadius of the victim
Config.FeedScope = 'global'
Config.FeedRadius = 400.0

-- Show suicides / accidental deaths (falls, drowning, own explosives...)
Config.ShowSuicides = true

-- Broadcast kills on NPC peds.
--   Scope: 'self'  = only the killer sees their own NPC kills
--          'global'= everyone sees NPC kills (spammy on busy servers)
Config.ShowNPCKills = true
Config.NPCKillScope = 'self'

-- Hard cap of entries on screen (players can't exceed this in-game)
Config.MaxEntries = 6

-- Anti-spam: minimum ms between accepted death reports per player
Config.ReportCooldown = 1500

-- ──────────────────────────────────────────────────────────────
--  DEFAULT PLAYER SETTINGS (everything below is editable in-game)
-- ──────────────────────────────────────────────────────────────
Config.Defaults = {
    variant      = 8,             -- killfeed style id (1-32, removed: 5,6,17,21,27,29)
    preset       = '',            -- name of the applied theme preset ('' = custom)
    uiColor      = '#ee1c3e',     -- kept in sync with 'accent' (one GLOBAL color for feed + UI)
    font         = 'Demon Slave', -- fixed: Demon Slave is the only font
    accent       = '#ee1c3e',     -- killfeed accent color
    scale        = 1.0,           -- 0.6 .. 1.6
    duration     = 6,             -- seconds each entry stays on screen (2..15)
    maxEntries   = 5,             -- 1 .. Config.MaxEntries

    streak       = true,          -- kill streak counter (12x)
    distance     = false,         -- distance chip (214m)
    headshotIcon = true,          -- crosshair/skull badge on headshots
    weaponIcons  = true,          -- per-weapon-type icons
    envIcons     = true,          -- vehicle context icons (car/bike/heli/plane/boat)
    killFx       = 2,             -- full-screen kill effect: 0=off 1=Pulse 2=Skull Pop 3=Blade Slash 4=Shockwave 5=Glitch
    fxY          = 47,            -- vertical position (%) of centered kill effects (Skull Pop)
    sounds       = true,          -- web-audio kill/headshot blips
    streamer     = false,         -- hide names & ids (YOU / PLAYER, #??)

    blood        = true,          -- realistic blood splatter overlay when YOU get shot
    bloodTime    = 4,             -- seconds until blood fades out (1..10)
    bloodAmount  = 1.0,           -- 0.4 .. 2.0 intensity multiplier

    x            = 72.0,          -- feed position, % of screen (top-left of container)
    y            = 72.0,
}


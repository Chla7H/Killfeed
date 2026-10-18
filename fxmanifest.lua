

fx_version 'cerulean'
game 'gta5'
lua54 'yes'

author 'Mega'
description 'Mega Killfeed - 26 variants, theme presets, kill effects, blood FX, real GTA weapon icons, in-game editor'
version '1.0.0'

shared_scripts {
    'config.lua',
    'locales/*.lua',
    'shared/weapons.lua',
}

client_scripts {
    'client/main.lua',
    'client/exports.lua',
}

server_scripts {
    'server/main.lua',
    'server/exports.lua',
}

ui_page 'web/index.html'

files {
    'web/index.html',
    'web/style.css',
    'web/app.js',
    'web/img/weapons/manifest.js',
    'web/img/weapons/*.png',
    'web/fonts/*.ttf',
}

-- Open files: configuration, locales, public exports and all NUI assets.
-- Protected: client/main.lua, server/main.lua, shared/weapons.lua
escrow_ignore {
    'README.md',
    'config.lua',
    'locales/*.lua',
    'client/exports.lua',
    'server/exports.lua',
    'web/*',
    'web/img/weapons/*',
}

dependency '/assetpacks'

dependency '/assetpacks'


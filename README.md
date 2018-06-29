# Tomeito

## Release

1.  Keychain Access > Menu > Certificate Assistant > Create a Certificate Authority > Name: singuerinc
2.  Pack the app and sign

```bash
yarn run pack
codesign --deep --force --verbose --sign 'singuerinc' ./out/Tomeito-darwin-x64/Tomeito.app
```

## Auto-update

Before release a new version, update the package.json file with the new version. Then update the tomeito-updater heroku app: `https://git.heroku.com/secret-plains-95341.git`

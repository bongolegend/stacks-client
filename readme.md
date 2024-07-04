# Stacks Client
Run the stacks app on iOS, Android, and Web.

## Development

### Setup
Install deps.
```npm install```

Start the dev server.
```npx expo start```

### deploy to Web
change config.ts to point to the right api, then:
```./deploy.sh```

Run bundle locally.
```npx serve dist -l 8081```

Upload bundle to google cloud storage bucket: `www.getstacks.io`


### deploy to Apple App Store
Build with the EAS service.
```eas build --platform ios --profile production```

Submit to App Store.
```eas submit -p ios```

# Stacks Client
Run the stacks app on iOS, Android, and Web.

## Development

### Setup
Install deps.
```npm install```

Start the dev server.
```npx expo start```

### deploy
change config.ts to point to the right api, then:
```./deploy.sh```

Run bundle locally.
```npx serve dist -l 8081```

Upload bundle to google cloud storage bucket: `www.getstacks.io`

### Reference

High-level reference of everything: https://www.reactnative.express/react
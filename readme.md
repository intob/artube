# Artube
This is the original client (reference implementation) that allows anyone to browse videos uploaded to the Arweave network using the schema defined below.

Any client can be built that interoperates with this one, as long as the same schema is followed.

Host this yourself, or go to artube.pages.dev, it doesn't matter.

To add content, either connect a browser wallet (such as ArConnect), or manually create the transaction using the schema defined below.

## Metadata
### JSON Schema
```json
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "properties": {
    "App-Name": {
      "type": "string"
    },
    "Artube-Type": {
      "type": "string",
      "enum": [ "video", "poster", "metadata", "channel" ]
    },
    "Artube-Video": {
      "type": "string"
    }
  },
  "required": [
    "App-Name",
    "Artube-Type"
  ]
}
```

### Types
#### video
https://arweave.app/tx/PbXQqLmMPueNORJVG-0FOizaCYOneOZ45iLAEpx9Ww0

#### poster
A poster image for a video. Normally, a client will display the latest one.

When querying the network for the poster, the client must enusre that only poster images owned by the video uploader address are evaluated. Otherwise, anyone can overwrite the poster image by uploading a file with the same `Artube-Video` reference.

https://arweave.app/tx/iVxqvkXinECcFsM5qDQtZKckv2rjZT0ldADB9g1YNmA

#### metadata
JSON object with the following structure:
```json
{
  "title": "Speedflying my dream lines of Chamonix",
  "description": "Thank you to all of the beautiful people in my life. Mucho love"
}
```
https://arweave.app/tx/3h4y-c0FxDjKJPBHi_ze7PUoYiW3hVmjjoqh6hbRfJY

#### channel
JSON object with the following structure:
```json
{
  "name": "Joey Innes",
  "description": "Spreading love & flying fast 🤍 🚀 🌱"
}
```
https://arweave.app/tx/8s-AOLGM6xNijqIgzffjwRxDaHGyKj6mVjq207NK-XM
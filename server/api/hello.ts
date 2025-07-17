export default defineEventHandler(async (event) => {

    const body = await readRawBody(event, false);
    const fileName = getHeader(event, 'x-file-name');
    const bucket = event.context.cloudflare.env.photo_me

    if (!fileName) {
        return {
            status: 'error',
            message: 'x-file-name header missing'
        }
    }
    if (!body) {
        return {
            status: 'error',
            message: 'req file missing'
        }
    }

    await bucket.put(fileName, new Blob([body]), {
        httpMetadata: {
            contentType: getHeader(event, 'content-type'),
            cacheControl: 'public, max-age=31536000, immutable'
        },
        customMetadata: {
            originalName: 'unknown',
            uploadedAt: new Date().toISOString(),
        }
    })

    return bucket.get(fileName);
});
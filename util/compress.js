const sharp = require("sharp")

function compress(input, avif, grayscale, quality, originSize, metadata) {
	let format = avif ? 'avif' : 'jpeg'
	const imgWidth = metadata.width
	const imgHeight = metadata.height
	let compressionQuality = quality
	let resizeWidth = null
	let resizeHeight = null
	let effortCPU = 1

	//workaround for webp max res limit && experimental avif compression
	if (imgHeight > 12480) {	//damn longstrip image
	  format = 'avif'
	  compressionQuality *= 0.1
	  resizeHeight = 12480
	  effortCPU = 1
	} else if (imgWidth > 1280 && imgHeight < 9360) {
	  format = 'avif'
	  compressionQuality *= 0.1
	  resizeWidth = 960
	  effortCPU = 1
	} else if (imgWidth > 960 && imgHeight < 2880) {
	  format = 'avif'
	  compressionQuality *= 0.1
	  resizeWidth = 864
	  effortCPU = 1
	} else {
	  format = 'webp'
	  compressionQuality *= 0.1
	  effortCPU = 1
	}
	
        quality = Math.ceil(compressionQuality)
	
	return sharp(input)
		.resize({
			width: resizeWidth,
			height: resizeHeight
		})
		.grayscale(grayscale)
		.toFormat(format, {
			quality: quality,
			preset: 'picture',
			effort: effortCPU
		})
		.toBuffer({resolveWithObject: true})
		.then(({data: output, info}) => {	// this way we can also get the info about output image, like height, width
		// .toBuffer()
		// .then( output => {
			return {
				err: null,
				headers: {
					"content-type": `image/${format}`,
					"content-length": info.size,
					"x-original-size": originSize,
					"x-bytes-saved": originSize - info.size,
				},
				output: output
			};
		}).catch(err => {
			return {
				err: err
			};
		});
}

module.exports = compress;

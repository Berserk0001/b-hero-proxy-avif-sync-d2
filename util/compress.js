const sharp = require("sharp")

function compress(input, webp, grayscale, quality, originSize, metadata) {
	let format = webp ? 'webp' : 'jpeg'
	const imgWidth = metadata.width
	const imgHeight = metadata.height
	let compressionQuality = quality
	let resizeWidth = null
	let resizeHeight = null
	let effortCPU = 6

	//workaround for webp max res limit && experimental avif compression
	if (imgHeight > 12480) {	//damn longstrip image
	  format = 'webp'
	  compressionQuality *= 0.5
	  resizeHeight = 12480
	  effortCPU = 6
	} else /*if (imgWidth <= 8704 && imgHeight <= 8704)*/ {
	  format = 'webp'
	  compressionQuality *= 0.5
	  effortCPU = 6
	} /*else if (imgWidth <= 16383 || imgHeight <= 16383) {
	  format = 'webp'
	  compressionQuality *= 0.5
	  effortCPU = 6
	}; */
	
        //quality = Math.ceil(compressionQuality)
	
	return sharp(input)
		.resize({
			width: resizeWidth,
			height: resizeHeight
		})
		.grayscale(grayscale)
		.toFormat(format, {
			quality: compressionQuality,
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

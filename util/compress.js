const sharp = require("sharp")

function compress(input, webp, grayscale, quality, originSize, metadata) {
	let format = webp ? 'webp' : 'jpeg'
	const imgWidth = metadata.width
	const imgHeight = metadata.height
	let compressionQuality = quality
	let resizeWidth = null
	let resizeHeight = null
	let effortCPU = 1

	
	
	  format = 'webp'
	  resizeWidth = 480
	  resizeHeight = 600
	  compressionQuality *= 0.05
	  effortCPU = 1
	
	
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

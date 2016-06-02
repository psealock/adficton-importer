'use strict'

const fs = require("fs")
const https = require('https')

const assets = {
	'adfliction.js': 'https://adapi.stuff.co.nz/adf-sdk/adfliction-sdk.0.1.js',
	'adfliction.native.js': 'https://adapi.stuff.co.nz/adf-sdk/adfliction-sdk.0.1.js',
	'adfliction.video.js': 'https://adapi.stuff.co.nz/adf-sdk/adfliction-sdk.0.1.js'
}
	
function wrapFile (filePath) {
	fs.readFile(filePath, 'utf-8', (err, data) => {
		if (err) throw err

		let newValue = data.replace(/^/,'export default function(ffxpub={}) {')
		newValue += '\nreturn ffxpub;\n}'

		fs.writeFile(filePath, newValue, 'utf-8', err => {
			if (err) throw err
			console.info(`File es6ified at: ${filePath}`)
		})
	})
}

function getAsset(uri, path) {
	const file = fs.createWriteStream(path)

	https.get(uri, response => {
		if (response.statusCode !== 200) {
			throw new Error(`Could not get external asset from: ${uri}`)
		}
		response.pipe(file)
		response.on('end', () => {
			console.info(`File created from : ${uri}`)
			wrapFile(path)
		})
	})
}

Object.keys(assets).forEach(key => {
	const uri = assets[key]
	const path = `src/${key}`
	getAsset(uri, path)
})


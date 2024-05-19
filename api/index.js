import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import profile from '../controllers/profile'

export const config = {
	runtime: 'edge'
}

const app = new Hono().basePath('/api')

// Add X-Response-Time header
app.use('*', async (c, next) => {
	const start = Date.now()
	const REQUEST_COUNTRY = c.req.header('x-vercel-ip-country')
	const REQUEST_CITY = c.req.header('x-vercel-ip-city')
	const REQUEST_COUNTRY_REGION = c.req.header('x-vercel-ip-country-region')
	const REQUEST_LATITUDE = c.req.header('x-vercel-ip-latitude')
	const REQUEST_LONGITUDE = c.req.header('x-vercel-ip-longitude')

	c.set("GLOBAL_REQUEST_COUNTRY", REQUEST_COUNTRY)
	c.set("GLOBAL_REQUEST_CITY", REQUEST_CITY)

	await next()

	const ms = Date.now() - start
	c.header('X-Response-Time', `${ms}ms`)
})


// Custom Not Found Message
app.notFound((c) => {
	return c.text('Custom 404 Not Found', 404)
})

// Error handling
app.onError((err, c) => {
	console.error(`${err}`)
	return c.text(`Custom Error Message : ${err}`, 500)
})


app.route('/profile', profile)

app.get('/', (c) => {
	const GLOBAL_REQUEST_CITY = c.get('GLOBAL_REQUEST_CITY')
	return c.json({ message: 'Hello Hono ! City : ' + GLOBAL_REQUEST_CITY })
})

export default handle(app)

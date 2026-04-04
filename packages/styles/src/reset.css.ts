import { globalStyle } from '@vanilla-extract/css'

globalStyle(':root', {
    boxSizing: 'border-box'
})

globalStyle('html, body', {
    margin: 0,
    padding: 0
})

globalStyle('h1, h2, h3, h4, h5, h6, p', {
    margin: 0,
    padding: 0,
    fontWeight: 'normal',
    fontSize: 'inherit',
    fontStyle: 'normal'
})
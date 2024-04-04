/**
 * Vuetify Configuration Module.
 *
 * <p>
 * This module sets up the Vuetify framework for the application. It includes configurations for components, directives,
 * styles, and themes. The module defines both light and dark themes for the application and sets the default theme to light.
 * </p>
 *
 * @module vuetify
 */

// Importing necessary configurations for Vuetify setup
import { md3 } from 'vuetify/blueprints'
import * as directives from 'vuetify/directives'
import * as components from 'vuetify/components'
import { createVuetify, type ThemeDefinition } from 'vuetify'

// Importing Vuetify and Material Design Icons styles
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

/**
 * Light theme configuration for the application.
 */
const light: ThemeDefinition = {
    dark: false,
    colors: {
        background: '#efefef',
        surface: '#fff',
        primary: '#513a75',
        'primary-darken-1': '#3B3486',
        secondary: '#E34A7F',
        'secondary-darken-1': '#A4194B',
        error: '#B00020',
        info: '#4496F3',
        success: '#16DB93',
        warning: '#CB8C00',
    },
}

/**
 * Dark theme configuration for the application.
 */
const dark: ThemeDefinition = {
    dark: true,
    colors: {
        background: '#0D1117',
        surface: '#161B22',
        primary: '#C9D1D9',
        'primary-darken-1': '#B1BAC4',
        secondary: '#58A6FF',
        'secondary-darken-1': '#3B82F6',
        error: '#F85149',
        info: '#58A6FF',
        success: '#3FB950',
        warning: '#DB6D28',
    },
}

/**
 * Initialize and configure the Vuetify instance with the defined themes, components, and directives.
 */
const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'light',
        themes: {
            light,
            dark,
        },
    },
    blueprint: md3,
})

export default vuetify

module.exports = {
    // votre configuration Jest existante...

    transformIgnorePatterns: [
        "/node_modules/(?!@material/material-color-utilities).+\\.js$"
    ]
};
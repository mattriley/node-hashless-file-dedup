const path = require('path');

module.exports = ({ io }) => async basepaths => {

    const groupedByBasepath = await Promise.all(basepaths.map(async basepath => {
        const files = await io.glob('**', { cwd: basepath, stats: true, dot: true, ignore: ['.DS_Store'] });
        return files.map(f => {
            const relpath = f.path;
            return {
                ...f,
                basepath,
                name: path.basename(relpath),
                ext: path.extname(relpath).replace('.', ''),
                relpath,
                reldirpath: path.dirname(relpath),
                path: path.join(basepath, relpath),
                size: f.stats.size
            };
        });
    }));

    return groupedByBasepath.flat().sort((a, b) => a.stats.size - b.stats.size);

};

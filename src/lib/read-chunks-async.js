module.exports = ({ lib }) => getStrategy => files => {

    return Promise.all(files.map(async f => {
        try {
            if (f.done) return f;
            f = await lib.openFileAsync(f, getStrategy);
            const { length, position } = f.strategy.next(f);
            const readResult = await f.handle.read(f.buffer, 0, length, position);
            const done = f.strategy.isDone(readResult, f);
            if (done) await lib.closeFilesAsync([f]);
            return { ...f, done };
        } catch (err) {
            err.context = { f };
            throw err;
        }
    }));
    
};

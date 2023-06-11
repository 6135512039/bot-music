const settings = (queue) => {
    const volume = queue.node.volume;
    const track = queue.currentTrack; 
    const author = track.author;
    const timestamp = queue.node.getTimestamp();
    const trackDuration = timestamp.progress == 'Forever' ? 'Endless (Live)' : track.duration;

    return `────────────────────\n`
        +`Author : ${author}\nDuration: ${trackDuration}\n`
        + `────────────────────\n`
        + `Volume: \`${volume}%\``;
        + `────────────────────\n`
};

module.exports.settings = settings;
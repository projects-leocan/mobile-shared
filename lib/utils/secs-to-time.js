const secsToTime = (secs) => {
    let isNegative = false;
    if (secs < 0) {
        isNegative = true;
        secs = Math.abs(secs);
    }

    const hours = Math.floor(secs / (60 * 60));

    const divisor_for_minutes = secs % (60 * 60);
    const minutes = Math.floor(divisor_for_minutes / 60);

    const divisor_for_seconds = divisor_for_minutes % 60;
    const seconds = Math.ceil(divisor_for_seconds);

    const obj = {
        "n": isNegative,
        "h": (hours < 10) ? '0' + hours.toString() : hours.toString(),
        "m": (minutes < 10) ? '0' + minutes.toString() : minutes.toString(),
        "s": (seconds < 10) ? '0' + seconds.toString() : seconds.toString()
    };
    return obj;
};

export default secsToTime;

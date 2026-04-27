let solarData = [];

exports.receiveData = (req, res) => {
    const data = req.body;

    solarData.push({
        ...data,
        timestamp: new Date()
    });

    res.json({ message: 'Data received' });
};

exports.getMetrics = (req, res) => {
    res.json(solarData);
};
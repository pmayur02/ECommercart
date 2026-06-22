const calculateDiscount = (subtotal, uniqueCategories) => {

    let percentageDiscount = 0;
    let diversityBonus = 0;

    // Value based discount
    if (subtotal >= 20000) {
        percentageDiscount = subtotal * 0.15;
    } else if (subtotal >= 10000) {
        percentageDiscount = subtotal * 0.10;
    } else if (subtotal >= 5000) {
        percentageDiscount = subtotal * 0.05;
    }

    // Diversity bonus
    if (uniqueCategories >= 5) {
        diversityBonus = 1000;
    } else if (uniqueCategories >= 3) {
        diversityBonus = 500;
    }

    return {
        percentageDiscount,
        diversityBonus,
        totalDiscount: percentageDiscount + diversityBonus
    };
};

module.exports = {
    calculateDiscount
};
/**
* HitRate (точность попадания)
* Показывает, насколько часто хотя бы один из предложенных 
* товаров оказывается релевантным (правильным) для пользователя
*/
export const calculateHitRate = (
    recommendations: Record<string, string[]>,
    relevantItems: Record<string, string[]>
): number => {
    let hits = 0;
    let total = 0;

    //Для каждого пользователя проверяет, есть ли пересечение 
    //между рекомендованными товарами и релевантными.
    for (const user in recommendations) {
        const recommended = recommendations[user];
        const relevant = relevantItems[user];
        if (relevant) {
            hits += recommended.some(item => relevant.includes(item)) ? 1 : 0;
            total += 1;
        }
    }
    //Делится число попаданий на общее число пользователей
    return hits / total;
};


/** Precision@K (точность на топ-K)
* Показывает долю релевантных товаров среди первых 𝐾
* рекомендованных для каждого пользователя.
*/
export const calculatePrecisionAtK = (
    recommendations: Record<string, string[]>,
    relevantItems: Record<string, string[]>,
    k: number
): number => {
    let totalPrecision = 0;
    let usersWithRelevantItems = 0;

    //Для каждого пользователя берутся первые K рекомендованных товаров.
    for (const user in recommendations) {
        const recommended = recommendations[user].slice(0, k);
        const relevant = relevantItems[user];
        if (relevant) {
            const hits = recommended.filter(item => relevant.includes(item)).length;
            
            //Вычисляется отношение числа релевантных товаров в топ-𝐾 к числу 𝐾
            totalPrecision += hits / k;
            usersWithRelevantItems += 1;
        }
    }
    //среднее значение Precision@K по всем пользователям
    return usersWithRelevantItems > 0 ? totalPrecision / usersWithRelevantItems : 0;
};

/** Recall@K (полнота на топ-K)
* Показывает долю релевантных товаров, найденных в первых 𝐾
* рекомендованных для каждого пользователя, относительно всех релевантных товаров.
*/
export const calculateRecallAtK = (
    recommendations: Record<string, string[]>,
    relevantItems: Record<string, string[]>,
    k: number
): number => {
    let totalRecall = 0;
    let usersWithRelevantItems = 0;

    //Для каждого пользователя берутся первые K рекомендованных товаров
    for (const user in recommendations) {
        const recommended = recommendations[user].slice(0, k);
        const relevant = relevantItems[user];
        if (relevant) {
            const hits = recommended.filter(item => relevant.includes(item)).length;
            
            //Вычисляется отношение числа релевантных товаров в топ-K к общему числу релевантных товаров
            totalRecall += hits / relevant.length;
            usersWithRelevantItems += 1;
        }
    }
    //среднее значение Recall@K по всем пользователям
    return usersWithRelevantItems > 0 ? totalRecall / usersWithRelevantItems : 0;
};

/** MRR (Mean Reciprocal Rank)
* Показывает, насколько высоко в списке 
* рекомендаций находится первый релевантный товар.
*/
export const calculateMRR = (
    recommendations: Record<string, string[]>,
    relevantItems: Record<string, string[]>
): number => {
    let totalMRR = 0;
    let usersWithRelevantItems = 0;

    //Для каждого пользователя находится позиция первого релевантного товара в списке рекомендаций.
    for (const user in recommendations) {
        const recommended = recommendations[user];
        const relevant = relevantItems[user];
        if (relevant) {
            const firstRelevantIndex = recommended.findIndex(item => relevant.includes(item));
            if (firstRelevantIndex !== -1) {
                
                //Вычисляется обратное значение этой позиции (1/rank)
                totalMRR += 1 / (firstRelevantIndex + 1);
            }
            usersWithRelevantItems += 1;
        }
    }
    
    //среднее значение MRR по всем пользователям
    return usersWithRelevantItems > 0 ? totalMRR / usersWithRelevantItems : 0;
};

/**
 * Выполняет коллаборативную фильтрацию для генерации списка рекомендаций (косинусное сходство).
* @param {number[][]} purchases - Матрица покупок пользователей. Каждая строка соответствует пользователю, а каждая колонка - товару.
 *                                 Значения: 1 (покупка) или 0 (нет покупки).
 * @param {string[]} items - Список товаров, где индекс соответствует столбцу матрицы покупок.
 * @param {string[]} users - Список пользователей, где индекс соответствует строке матрицы покупок.
 * @returns {Promise<Record<string, string[]>>} Объект, где ключ - имя пользователя, а значение - массив рекомендованных товаров.
 */

export const calculateCollaborativeFiltering = async (
    purchases: number[][],
    items: string[],
    users: string[]
): Promise<Record<string, string[]>> => {
    console.time("Collaborative Filtering Time"); // Начало замера времени

    const recommendations: Record<string, string[]> = {}; // Результат для каждого пользователя

    // Вычисление косинусного сходства
    const calculateCosineSimilarity = (vecA: number[], vecB: number[]): number => {
        const dotProduct = vecA.reduce((sum, val, idx) => sum + val * vecB[idx], 0);
        const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val ** 2, 0));
        const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val ** 2, 0));
        return magnitudeA && magnitudeB ? dotProduct / (magnitudeA * magnitudeB) : 0;
    };

    // Основной алгоритм
    purchases.forEach((userPurchases, userIndex) => {
        const similarities: { user: number; score: number }[] = [];

        // Вычисляем сходство текущего пользователя с остальными
        purchases.forEach((otherPurchases, otherIndex) => {
            if (userIndex !== otherIndex) {
                const similarity = calculateCosineSimilarity(userPurchases, otherPurchases);
                similarities.push({ user: otherIndex, score: similarity });
            }
        });

        // Сортируем пользователей по сходству (по убыванию)
        similarities.sort((a, b) => b.score - a.score);

        // Берём рекомендации от пользователей с наибольшим сходством
        const topSimilarUserIndex = similarities[0]?.user;
        const recommendedItems: string[] = [];

        if (topSimilarUserIndex !== undefined) {
            const similarUserPurchases = purchases[topSimilarUserIndex];

            // Добавляем товары, которые похожий пользователь купил, но текущий — нет
            similarUserPurchases.forEach((item, itemIndex) => {
                if (item === 1 && userPurchases[itemIndex] === 0) {
                    recommendedItems.push(items[itemIndex]);
                }
            });
        }

        recommendations[users[userIndex]] = recommendedItems;
    });

    console.timeEnd("Collaborative Filtering Time"); // Конец замера времени
    return recommendations;
};

import { SVD } from 'ml-matrix';

/**
 * Выполняет матричную факторизацию для построения рекомендаций на основе матрицы покупок (SVD).
 *
 * @param {number[][]} purchases - Матрица покупок пользователей, где строки соответствуют пользователям, а столбцы - товарам. Значения:
 *                                 1 (покупка) или 0 (нет покупки).
 * @param {string[]} items - Список товаров, где индекс соответствует столбцу матрицы покупок.
 * @param {string[]} users - Список пользователей, где индекс соответствует строке матрицы покупок.
 * @param {number} [numFactors=10] - Количество факторов для уменьшения размерности в SVD.
 * @returns {Promise<Record<string, string[]>>} Объект, где ключ - имя пользователя, а значение - массив рекомендованных товаров.
 *
 */

export const calculateMatrixFactorization = async (
    purchases: number[][],
    items: string[],
    users: string[],
    numFactors: number = 10
): Promise<Record<string, string[]>> => {
    console.time('Matrix Factorization Time'); // Замер времени выполнения

    // Создаём матрицу из покупок
    const ratingsMatrix = new SVD(purchases, { autoTranspose: true });

    // Получаем только numFactors главных компонент
    const U = ratingsMatrix.leftSingularVectors; // U матрица
    const S = ratingsMatrix.diagonalMatrix; // Диагональная матрица
    const V = ratingsMatrix.rightSingularVectors; // V матрица

    const truncatedU = U.subMatrix(0, U.rows - 1, 0, numFactors - 1);
    const truncatedS = S.subMatrix(0, numFactors - 1, 0, numFactors - 1);
    const truncatedV = V.subMatrix(0, V.rows - 1, 0, numFactors - 1);

    // Восстановление приближённой матрицы
    const approxMatrix = truncatedU.mmul(truncatedS).mmul(truncatedV.transpose());

    const recommendations: Record<string, string[]> = {};

    // Генерация рекомендаций для каждого пользователя
    for (let userIndex = 0; userIndex < approxMatrix.rows; userIndex++) {
        const userRatings = approxMatrix.getRow(userIndex);

        // Оставляем только товары, которые пользователь не купил
        const unratedItems = purchases[userIndex]
            .map((rating, index) => (rating === 0 ? index : -1))
            .filter(index => index !== -1);

        // Сортируем товары по предсказанным оценкам
        const sortedItems = unratedItems.sort((a, b) => userRatings[b] - userRatings[a]);

        // Сохраняем рекомендации
        recommendations[users[userIndex]] = sortedItems.map(index => items[index]);
    }

    console.timeEnd('Matrix Factorization Time'); // Конец замера времени
    return recommendations;
};

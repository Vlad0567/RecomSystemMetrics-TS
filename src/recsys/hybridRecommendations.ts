/**
 * 
 * @param {Record<string, string[]>} collaborativeRecommendations - Рекомендации, полученные методом коллаборативной фильтрации.
 * @param {Record<string, string[]>} matrixRecommendations - Рекомендации, полученные методом матричной факторизации.
 * @param {number} topN - Максимальное количество рекомендаций для одного пользователя.
 * @returns {{
 *   ensembleRecommendations: Record<string, string[]>,
 *   cascadeRecommendations: Record<string, string[]>
 * }} Объект, содержащий рекомендации для каждого пользователя:
 * - `ensembleRecommendations`: Рекомендации, построенные на основе ансамблевого подхода.
 * - `cascadeRecommendations`: Рекомендации, построенные на основе каскадного подхода.
 */

export const calculateHybridRecommendations = (
    collaborativeRecommendations: Record<string, string[]>,
    matrixRecommendations: Record<string, string[]>,
    topN: number
) => {
    const ensembleRecommendations: Record<string, string[]> = {};
    const cascadeRecommendations: Record<string, string[]> = {};

    // Ансамбль
    for (const user in collaborativeRecommendations) {
        const collabRec = collaborativeRecommendations[user] || [];
        const matrixRec = matrixRecommendations[user] || [];
        const combinedSet = new Set([...collabRec, ...matrixRec]);

        // Повышаем приоритет для пересечений
        const priorityItems: string[] = collabRec.filter((item) => matrixRec.includes(item));

        // Объединяем пересечения и оставшиеся рекомендации
        const allRecommendations = [...priorityItems, ...Array.from(combinedSet).filter(
            (item) => !priorityItems.includes(item)
        )];

        ensembleRecommendations[user] = allRecommendations;
    }

    // Каскадная модель
    for (const user in collaborativeRecommendations) {
        const collabRec = collaborativeRecommendations[user] || [];
        const matrixRec = matrixRecommendations[user] || [];

        // Используем коллаборативные рекомендации как базу
        const cascadeRec = [...collabRec];

        // Добавляем оставшиеся рекомендации из матричной факторизации
        for (const item of matrixRec) {
            if (!cascadeRec.includes(item)) {
                cascadeRec.push(item);
            }
        }

        cascadeRecommendations[user] = cascadeRec;
    }

    return { ensembleRecommendations, cascadeRecommendations };
};

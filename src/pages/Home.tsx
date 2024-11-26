import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import Button from '../UI/Button';
import Table from '../UI/Table';
import { calculateCollaborativeFiltering } from '../recsys/collaborativeFiltering';
import { calculateMatrixFactorization } from '../recsys/matrixFactorization';
import { calculateHybridRecommendations } from '../recsys/hybridRecommendations';
import {
    calculateHitRate,
    calculatePrecisionAtK,
    calculateRecallAtK,
    calculateMRR,
} from '../recsys/metrics';



const Home: React.FC = () => {
    const [N, setN] = useState<number>(5);
    const [userCount, setUserCount] = useState<number>(0);
    const [itemCount, setItemCount] = useState<number>(0);
    const navigate = useNavigate();

    const [isCalculated, setIsCalculated] = useState(false);
    const [collaborativeMetrics, setCollaborativeMetrics] = useState<(string | number)[][]>([]);
    const [matrixMetrics, setMatrixMetrics] = useState<(string | number)[][]>([]);
    const [hybridEnsembleMetrics, setHybridEnsembleMetrics] = useState<(string | number)[][]>([]);
    const [hybridCascadeMetrics, setHybridCascadeMetrics] = useState<(string | number)[][]>([]);
    

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('data') || '{}');
        setUserCount(storedData.users?.length || 0);
        setItemCount(storedData.items?.length || 0);

        const isCalculatedStored = localStorage.getItem('isCalculated') === 'true';
        setIsCalculated(isCalculatedStored);

        if (isCalculatedStored) {
            const truncatedCollaborative = JSON.parse(localStorage.getItem('truncatedCollaborativeRecommendations') || '[]');
            const truncatedMatrix = JSON.parse(localStorage.getItem('truncatedMatrixRecommendations') || '[]');
            const truncatedHybridEnsemble = JSON.parse(localStorage.getItem('truncatedHybridEnsembleRecommendations') || '[]');
            const truncatedHybridCascade = JSON.parse(localStorage.getItem('truncatedHybridCascadeRecommendations') || '[]');
            const relevantItems = storedData.relevant_items;

            if (relevantItems) {
                setCollaborativeMetrics(calculateMetrics(truncatedCollaborative, relevantItems));
                setMatrixMetrics(calculateMetrics(truncatedMatrix, relevantItems));
                setHybridEnsembleMetrics(calculateMetrics(truncatedHybridEnsemble, relevantItems));
                setHybridCascadeMetrics(calculateMetrics(truncatedHybridCascade, relevantItems));
            }
        }
    }, []);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setN(event.target.value ? parseInt(event.target.value, 10) : 0);
    };

    const truncateRecommendations = (
        recommendations: Record<string, string[]> | undefined,
        n: number
    ): Record<string, string[]> => {
        if (!recommendations) return {};
        const truncated: Record<string, string[]> = {};
        for (const user in recommendations) {
            truncated[user] = recommendations[user].slice(0, n);
        }
        return truncated;
    };

    const calculateMetrics = (
        recommendations: Record<string, string[]>,
        relevantItems: Record<string, string[]>
    ): (string | number)[][] => {
        if (!recommendations || !Object.keys(recommendations).length) return [['-', '-', '-', '-']];
        const hitRate = calculateHitRate(recommendations, relevantItems);
        const precisionAtK = calculatePrecisionAtK(recommendations, relevantItems, N);
        const recallAtK = calculateRecallAtK(recommendations, relevantItems, N);
        const mrr = calculateMRR(recommendations, relevantItems);

        return [
            [hitRate.toFixed(2), precisionAtK.toFixed(2), recallAtK.toFixed(2), mrr.toFixed(2)],
        ];
    };

    const handleCalculate = async () => {
        const storedData = JSON.parse(localStorage.getItem('data') || '{}');
        const { purchases, items, users, relevant_items } = storedData;
    
        // Расчёт коллаборативной фильтрации
        const collaborativeRecommendations = await calculateCollaborativeFiltering(purchases, items, users);
    
        // Расчёт матричной факторизации
        const matrixRecommendations = await calculateMatrixFactorization(purchases, items, users);
    
        // Расчёт гибридных моделей
        const { ensembleRecommendations, cascadeRecommendations } = calculateHybridRecommendations(
            truncateRecommendations(collaborativeRecommendations, 10),
            truncateRecommendations(matrixRecommendations, 10),
            N
        );
    
        // Сохранение данных
        localStorage.setItem('fullCollaborativeRecommendations', JSON.stringify(collaborativeRecommendations));
        localStorage.setItem('fullMatrixRecommendations', JSON.stringify(matrixRecommendations));
        localStorage.setItem('fullHybridEnsembleRecommendations', JSON.stringify(ensembleRecommendations));
        localStorage.setItem('fullHybridCascadeRecommendations', JSON.stringify(cascadeRecommendations));
    
        const truncatedCollaborative = truncateRecommendations(collaborativeRecommendations, N);
        const truncatedMatrix = truncateRecommendations(matrixRecommendations, N);
        const truncatedHybridEnsemble = truncateRecommendations(ensembleRecommendations, N);
        const truncatedHybridCascade = truncateRecommendations(cascadeRecommendations, N);
    
        localStorage.setItem('truncatedCollaborativeRecommendations', JSON.stringify(truncatedCollaborative));
        localStorage.setItem('truncatedMatrixRecommendations', JSON.stringify(truncatedMatrix));
        localStorage.setItem('truncatedHybridEnsembleRecommendations', JSON.stringify(truncatedHybridEnsemble));
        localStorage.setItem('truncatedHybridCascadeRecommendations', JSON.stringify(truncatedHybridCascade));
    
        // Обновление метрик
        setCollaborativeMetrics(calculateMetrics(truncatedCollaborative, relevant_items));
        setMatrixMetrics(calculateMetrics(truncatedMatrix, relevant_items));
        setHybridEnsembleMetrics(calculateMetrics(truncatedHybridEnsemble, relevant_items));
        setHybridCascadeMetrics(calculateMetrics(truncatedHybridCascade, relevant_items));
    
        localStorage.setItem('isCalculated', 'true');
        setIsCalculated(true);
    };

    return (
        <div className='Home'>
            <h1>Разработка рекомендательной системы</h1>
            <div className="stats">
                <p>Количество пользователей — {userCount}</p>
                <p>Количество товаров — {itemCount}</p>
                <div className='input-section'>
                    <p>Размер выборки рекомендаций — </p>
                    <input
                        type='number'
                        className="input-field"
                        value={N}
                        onChange={handleInputChange}
                    />
                </div>
                <div className='buttons-nav'>
                    <Button onClick={() => navigate('/InitData')}>Исходная выборка</Button>
                    <Button onClick={handleCalculate}>Рассчитать</Button>
                </div>
            </div>

            <div className='recblocks'>
                <div className="recommendation-block">
                    <h2>Коллаборативная фильтрация</h2>
                    <Button
                        onClick={() =>
                            navigate('/CalculateData', {
                                state: {
                                    type: 'Коллаборативная фильтрация',
                                    algorithm: 'Косинусное сходство',
                                    fullDataKey: 'fullCollaborativeRecommendations',
                                    truncatedDataKey: 'truncatedCollaborativeRecommendations',
                                },
                            })
                        }
                        disabled={!isCalculated}
                    >
                        Просмотреть
                    </Button>
                    <div className="table-metric">
                        <Table
                            data={collaborativeMetrics}
                            columns={4}
                            headers={['HitRate', 'Precision@K', 'Recall@K', 'MRR']}
                            style={{ maxHeight: '200px', overflow: 'auto' }}
                        />
                    </div>
                </div>

                <div className="recommendation-block">
                    <h2>Матричная факторизация</h2>
                    <Button
                        onClick={() =>
                            navigate('/CalculateData', {
                                state: {
                                    type: 'Матричная факторизация',
                                    algorithm: 'SVD',
                                    fullDataKey: 'fullMatrixRecommendations',
                                    truncatedDataKey: 'truncatedMatrixRecommendations',
                                },
                            })
                        }
                        disabled={!isCalculated}
                    >
                        Просмотреть
                    </Button>
                    <div className="table-metric">
                        <Table
                            data={matrixMetrics}
                            columns={4}
                            headers={['HitRate', 'Precision@K', 'Recall@K', 'MRR']}
                            style={{ maxHeight: '200px', overflow: 'auto' }}
                        />
                    </div>
                </div>
            </div>

            <div className='hybr'>
                <div className="recommendation-block">
                    <h2>Гибридная рекомендательная система</h2>
                    <Button
                        onClick={() => navigate('/HybridData')}
                        disabled={!isCalculated}
                    >
                        Просмотреть
                    </Button>
                    <div className="table-metric">
                        <Table
                            data={[
                                ['Ансамбль', ...(hybridEnsembleMetrics[0] || ['-', '-', '-', '-'])],
                                ['Каскадная', ...(hybridCascadeMetrics[0] || ['-', '-', '-', '-'])],
                            ]}
                            columns={5}
                            headers={['Модель', 'HitRate', 'Precision@K', 'Recall@K', 'MRR']}
                            style={{ maxHeight: '200px' }}
                        />
                    </div>
                </div>

                {/* Сравнительная таблица */}
                <div className="recommendation-block">
                    <h2>Сравнительная таблица метрик качества рекомендательных систем</h2>
                    <div className="table-metric">
                        <Table
                            data={[
                                ['Коллаборативная', ...collaborativeMetrics[0] || ['-', '-', '-', '-']],
                                ['Матричная', ...matrixMetrics[0] || ['-', '-', '-', '-']],
                                ['Гибридная (Ансамбль)', ...(hybridEnsembleMetrics[0] || ['-', '-', '-', '-'])],
                                ['Гибридная (Каскадная)', ...(hybridCascadeMetrics[0] || ['-', '-', '-', '-'])],
                            ]}
                            columns={5}
                            headers={['Модель', 'HitRate', 'Precision@K', 'Recall@K', 'MRR']}
                            style={{ maxHeight: '500px' }}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Home;

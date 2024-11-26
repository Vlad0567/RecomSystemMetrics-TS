import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Table from '../UI/Table';
import './CalculateData.css';

const CalculateData: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Извлекаем данные из параметров маршрута
    const { state } = location as any;
    const { type, algorithm, fullDataKey, truncatedDataKey } = state;

    // Данные из localStorage
    const fullRecommendations = JSON.parse(localStorage.getItem(fullDataKey) || '{}');
    const truncatedRecommendations = JSON.parse(localStorage.getItem(truncatedDataKey) || '{}');

    const convertToTableData = (data: Record<string, string[]>): (string | number)[][] => {
        const headers: string[] = ['User', 'Recommendations']; // Все элементы — строки
        const rows = Object.entries(data).map(([user, recommendations]) => [
            user,
            recommendations.join(', '),
        ]);
        return [headers, ...rows];
    };

    const fullTableData = convertToTableData(fullRecommendations);
    const truncatedTableData = convertToTableData(truncatedRecommendations);

    return (
        <div className="CalculateData">
            <h1>{type}</h1>
            <h2>{algorithm}</h2>

            <h3>Полная версия рекомендаций</h3>
            <div className="table-wrapper">
                <Table
                    data={fullTableData.slice(1)}
                    columns={2}
                    headers={fullTableData[0] as string[]}
                    style={{ maxHeight: '300px', overflow: 'auto' }}
                />
            </div>

            <h3>Топ-N версия рекомендаций</h3>
            <div className="table-wrapper">
                <Table
                    data={truncatedTableData.slice(1)}
                    columns={2}
                    headers={truncatedTableData[0] as string[]}
                    style={{ maxHeight: '300px', overflow: 'auto' }}
                />
            </div>

            <div className="button-wrapper">
                <button className="back-button" onClick={() => navigate('/')}>
                    Вернуться на главную
                </button>
            </div>
        </div>
    );
};

export default CalculateData;

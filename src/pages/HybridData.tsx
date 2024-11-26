import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './HybridData.css';
import Button from '../UI/Button';
import Table from '../UI/Table';

const HybridData: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Получаем данные из localStorage
    const [fullHybridEnsembleData, setFullHybridEnsembleData] = useState<Record<string, string[]> | null>(null);
    const [fullHybridCascadeData, setFullHybridCascadeData] = useState<Record<string, string[]> | null>(null);

    const [truncatedHybridEnsembleData, setTruncatedHybridEnsembleData] = useState<Record<string, string[]> | null>(null);
    const [truncatedHybridCascadeData, setTruncatedHybridCascadeData] = useState<Record<string, string[]> | null>(null);

    useEffect(() => {
        const fullEnsemble = JSON.parse(localStorage.getItem('fullHybridEnsembleRecommendations') || '{}');
        const fullCascade = JSON.parse(localStorage.getItem('fullHybridCascadeRecommendations') || '{}');
        const truncatedEnsemble = JSON.parse(localStorage.getItem('truncatedHybridEnsembleRecommendations') || '{}');
        const truncatedCascade = JSON.parse(localStorage.getItem('truncatedHybridCascadeRecommendations') || '{}');

        setFullHybridEnsembleData(fullEnsemble);
        setFullHybridCascadeData(fullCascade);
        setTruncatedHybridEnsembleData(truncatedEnsemble);
        setTruncatedHybridCascadeData(truncatedCascade);
    }, []);

    const renderTableData = (data: Record<string, string[]> | null): (string | number)[][] => {
        if (!data) return [['-', '-']];
        return Object.entries(data).map(([user, items]) => [user, items.join(', ')]);
    };

    return (
        <div className="HybridData">
            <h1>Гибридная рекомендательная система</h1>

            {/* Ансамбль */}
            <h2>Модель: Ансамбль</h2>
            <h3>Полная версия рекомендаций</h3>
            <Table
                data={renderTableData(fullHybridEnsembleData)}
                columns={2}
                headers={['Пользователь', 'Рекомендованные товары']}
                style={{ maxHeight: '300px', overflow: 'auto' }}
            />
            <h3>Топ-N версия рекомендаций</h3>
            <Table
                data={renderTableData(truncatedHybridEnsembleData)}
                columns={2}
                headers={['Пользователь', 'Рекомендованные товары']}
                style={{ maxHeight: '300px', overflow: 'auto' }}
            />

            {/* Каскадная модель */}
            <h2>Модель: Каскадная</h2>
            <h3>Полная версия рекомендаций</h3>
            <Table
                data={renderTableData(fullHybridCascadeData)}
                columns={2}
                headers={['Пользователь', 'Рекомендованные товары']}
                style={{ maxHeight: '300px', overflow: 'auto' }}
            />
            <h3>Топ-N версия рекомендаций</h3>
            <Table
                data={renderTableData(truncatedHybridCascadeData)}
                columns={2}
                headers={['Пользователь', 'Рекомендованные товары']}
                style={{ maxHeight: '300px', overflow: 'auto' }}
            />

            {/* Кнопка возврата */}
            <div className="button-section">
                <Button onClick={() => navigate('/')}>На главную</Button>
            </div>
        </div>
    );
};

export default HybridData;

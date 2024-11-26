import React from 'react';
import Table from '../UI/Table';
import { useNavigate } from 'react-router-dom';
import Button from '../UI/Button';
import './InitData.css';

const InitData: React.FC = () => {
    const navigate = useNavigate();


    const storedData = JSON.parse(localStorage.getItem('data') || '{}');
    const { items, users, purchases, relevant_items }: {
        items: string[];
        users: string[];
        purchases: number[][];
        relevant_items: Record<string, string[]>;
    } = storedData;


    const relevantItemsTable = Object.entries(relevant_items).map(([user, relProducts]) => [user, relProducts.join(', ')]);

    return (
        <div className="InitData">
            <h1>Данные исходной выборки</h1>
            <div className="table-wrapper">
                <Table
                    data={purchases.map((row: number[], i: number) => [users[i], ...row])} // Добавляем пользователей в первую колонку
                    columns={items.length + 1}
                    headers={['User', ...items]}
                    style={{ maxHeight: '500px', overflow: 'auto' }} // Прокрутка
                />
            </div>
            <h2>Релевантные товары</h2>
            <div className="table-wrapper">
                <Table
                    data={relevantItemsTable}
                    columns={2}
                    headers={['User', 'Rel_product']}
                    style={{ maxHeight: '400px', overflow: 'auto' }} // Прокрутка
                />
            </div>
            <div className="back-button">
                <Button onClick={() => navigate('/')}>Вернуться на главную</Button>
            </div>
        </div>
    );
};

export default InitData;

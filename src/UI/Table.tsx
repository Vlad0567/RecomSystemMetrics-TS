import React from 'react';

interface TableProps {
    data: (string | number)[][];
    columns: number;
    headers: string[];
    style?: React.CSSProperties;
}

const Table: React.FC<TableProps> = ({ data, columns, headers, style }) => {
    return (
        <div style={{ overflow: 'auto', ...style }}>
            <table style={{ borderCollapse: 'separate', width: '100%' }}>
                <thead>
                    <tr>
                        {headers.map((header, index) => (
                            <th
                                key={index}
                                style={{
                                    border: '1px solid black',
                                    padding: '8px',
                                    position: 'sticky',
                                    top: 0,
                                    left: index === 0 ? 0 : undefined, // Фиксируем первый столбец
                                    zIndex: index === 0 ? 2 : 1, // Увеличиваем z-index для пересечения с другими sticky элементами
                                    background: '#f4f4f4',
                                }}
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                                <td
                                    key={cellIndex}
                                    style={{
                                        border: '1px solid black',
                                        padding: '8px',
                                        position: cellIndex === 0 ? 'sticky' : undefined, // Фиксируем первый столбец
                                        left: cellIndex === 0 ? 0 : undefined,
                                        background: cellIndex === 0 ? '#f9f9f9' : 'white', // Устанавливаем фон для фиксированного столбца
                                        zIndex: cellIndex === 0 ? 1 : 0, // z-index для фиксированного столбца
                                    }}
                                >
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;

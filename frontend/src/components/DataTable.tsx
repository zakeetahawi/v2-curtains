import { Table, Input, Space, Button } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';
import { useState } from 'react';

interface DataTableProps<T> extends TableProps<T> {
    searchPlaceholder?: string;
    onSearch?: (value: string) => void;
    onRefresh?: () => void;
    showSearch?: boolean;
    showRefresh?: boolean;
    extraActions?: React.ReactNode;
}

export function DataTable<T extends object>({
    searchPlaceholder = 'بحث...',
    onSearch,
    onRefresh,
    showSearch = true,
    showRefresh = true,
    extraActions,
    ...tableProps
}: DataTableProps<T>) {
    const [searchValue, setSearchValue] = useState('');

    const handleSearch = (value: string) => {
        setSearchValue(value);
        onSearch?.(value);
    };

    return (
        <div>
            {(showSearch || showRefresh || extraActions) && (
                <div style={{
                    marginBottom: 16,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 12
                }}>
                    <Space wrap>
                        {showSearch && (
                            <Input
                                placeholder={searchPlaceholder}
                                prefix={<SearchOutlined />}
                                value={searchValue}
                                onChange={(e) => handleSearch(e.target.value)}
                                style={{ width: 300 }}
                                size="large"
                                allowClear
                            />
                        )}
                        {showRefresh && (
                            <Button
                                icon={<ReloadOutlined />}
                                onClick={onRefresh}
                                size="large"
                            >
                                تحديث
                            </Button>
                        )}
                    </Space>
                    {extraActions && <Space wrap>{extraActions}</Space>}
                </div>
            )}

            <Table
                {...tableProps}
                className="professional-table"
                pagination={{
                    ...tableProps.pagination,
                    showSizeChanger: false,
                    showTotal: (total) => `إجمالي ${total} سجل`,
                    style: { marginTop: 16 }
                }}
                scroll={{ x: 800 }}
            />
        </div>
    );
}

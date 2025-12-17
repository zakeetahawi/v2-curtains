import { useState, useEffect } from 'react';
import {
    Card, Typography, Tag, Space, Button,
    DatePicker, Select, Statistic, Row, Col, message
} from 'antd';
import {
    DollarOutlined, ShoppingCartOutlined,
    UserOutlined, CalendarOutlined, PlusOutlined, EyeOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { salesService } from '../services/sales.service';
import type { SalesOrder } from '../types';
import { DataTable } from '../components/DataTable';

const { Title } = Typography;
const { RangePicker } = DatePicker;

export default function SalesPage() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<SalesOrder[]>([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchOrders();
    }, [page]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await salesService.getAll(page, 10);
            if (response.success && response.data) {
                setOrders(response.data.orders || []);
                setTotal(response.data.total || 0);
            }
        } catch (error) {
            message.error('فشل تحميل الطلبات');
        } finally {
            setLoading(false);
        }
    };

    const columns: ColumnsType<SalesOrder> = [
        {
            title: 'رقم الطلب',
            dataIndex: 'id',
            key: 'id',
            width: 120,
            render: (id) => (
                <strong style={{ color: '#1890ff', fontFamily: 'monospace' }}>
                    ORD-{String(id).padStart(5, '0')}
                </strong>
            ),
        },
        {
            title: 'العميل',
            dataIndex: ['customer', 'name'],
            key: 'customer',
            render: (text) => (
                <Space>
                    <UserOutlined style={{ color: '#8c8c8c' }} />
                    <span style={{ fontWeight: 500 }}>{text || 'غير محدد'}</span>
                </Space>
            ),
        },
        {
            title: 'التاريخ',
            dataIndex: 'order_date',
            key: 'order_date',
            render: (date) => (
                <Space>
                    <CalendarOutlined style={{ color: '#8c8c8c' }} />
                    {dayjs(date).format('YYYY/MM/DD')}
                </Space>
            ),
        },
        {
            title: 'عدد الأصناف',
            dataIndex: 'items',
            key: 'items_count',
            align: 'center',
            render: (items) => (
                <Tag color="blue" style={{ fontSize: 14, padding: '4px 12px', borderRadius: 6, fontWeight: 600 }}>
                    {items?.length || 0}
                </Tag>
            ),
        },
        {
            title: 'الإجمالي',
            dataIndex: 'total_amount',
            key: 'total_amount',
            render: (total) => (
                <span style={{ fontSize: 15, fontWeight: 600, color: '#52c41a' }}>
                    {(total || 0).toLocaleString()} جنيه
                </span>
            ),
        },
        {
            title: 'الحالة',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const colors: Record<string, string> = {
                    completed: 'success',
                    pending: 'warning',
                    cancelled: 'error',
                };
                const labels: Record<string, string> = {
                    completed: 'مكتمل',
                    pending: 'قيد المعالجة',
                    cancelled: 'ملغي',
                };
                return (
                    <Tag
                        color={colors[status]}
                        style={{ fontSize: 13, padding: '6px 14px', borderRadius: 6, fontWeight: 500 }}
                    >
                        {labels[status] || status}
                    </Tag>
                );
            },
        },
        {
            title: 'الإجراءات',
            key: 'actions',
            width: 100,
            fixed: 'right',
            render: (_, record) => (
                <Button
                    type="text"
                    icon={<EyeOutlined />}
                    onClick={() => navigate(`/sales/${record.id}`)}
                    style={{ color: '#1890ff' }}
                >
                    عرض
                </Button>
            ),
        },
    ];

    // Calculate statistics from orders
    const todaySales = orders
        .filter(o => dayjs(o.order_date).isSame(dayjs(), 'day'))
        .reduce((sum, o) => sum + (o.total_amount || 0), 0);

    const todayOrders = orders.filter(o => dayjs(o.order_date).isSame(dayjs(), 'day')).length;

    const avgOrderValue = orders.length > 0
        ? orders.reduce((sum, o) => sum + (o.total_amount || 0), 0) / orders.length
        : 0;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, alignItems: 'center' }}>
                <Title level={2} style={{ margin: 0 }}>إدارة المبيعات</Title>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    size="large"
                    onClick={() => navigate('/sales/new')}
                >
                    طلب جديد
                </Button>
            </div>

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="مبيعات اليوم"
                            value={todaySales}
                            prefix={<DollarOutlined />}
                            suffix="جنيه"
                            valueStyle={{ color: '#3f8600', fontSize: 24 }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="عدد الطلبات"
                            value={todayOrders}
                            prefix={<ShoppingCartOutlined />}
                            valueStyle={{ color: '#1890ff', fontSize: 24 }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="متوسط قيمة الطلب"
                            value={Math.round(avgOrderValue)}
                            prefix={<DollarOutlined />}
                            suffix="جنيه"
                            valueStyle={{ fontSize: 24 }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="إجمالي الطلبات"
                            value={total}
                            prefix={<ShoppingCartOutlined />}
                            valueStyle={{ color: '#722ed1', fontSize: 24 }}
                        />
                    </Card>
                </Col>
            </Row>

            <Card>
                <Space style={{ marginBottom: 16 }} wrap size="middle">
                    <RangePicker
                        size="large"
                        placeholder={['من تاريخ', 'إلى تاريخ']}
                        suffixIcon={<CalendarOutlined />}
                        style={{ borderRadius: 8 }}
                    />
                    <Select
                        size="large"
                        placeholder="حالة الطلب"
                        style={{ width: 180, borderRadius: 8 }}
                        allowClear
                    >
                        <Select.Option value="completed">مكتمل</Select.Option>
                        <Select.Option value="pending">قيد المعالجة</Select.Option>
                        <Select.Option value="cancelled">ملغي</Select.Option>
                    </Select>
                    <Button type="primary" size="large">
                        بحث
                    </Button>
                </Space>

                <DataTable
                    columns={columns}
                    dataSource={orders}
                    rowKey="id"
                    loading={loading}
                    showSearch={false}
                    onRefresh={fetchOrders}
                    pagination={{
                        current: page,
                        total,
                        pageSize: 10,
                        onChange: setPage,
                    }}
                />
            </Card>
        </div>
    );
}

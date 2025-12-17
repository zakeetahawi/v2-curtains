import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Card, Descriptions, Button, Space, Table, Tag, Steps,
    Statistic, Row, Col, Typography, Timeline
} from 'antd';
import {
    ArrowLeftOutlined, UserOutlined, CalendarOutlined,
    DollarOutlined, CheckCircleOutlined, ClockCircleOutlined,
    CloseCircleOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { salesService } from '../services/sales.service';
import type { SalesOrder, SalesOrderItem } from '../types';

const { Title, Text } = Typography;

export default function OrderDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [order, setOrder] = useState<SalesOrder | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            fetchOrder();
        }
    }, [id]);

    const fetchOrder = async () => {
        setLoading(true);
        try {
            const response = await salesService.getOne(Number(id));
            if (response.success && response.data) {
                setOrder(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch order');
        } finally {
            setLoading(false);
        }
    };

    const getStatusInfo = (status: string) => {
        const statusMap: Record<string, { color: string; icon: any; text: string; step: number }> = {
            pending: {
                color: 'warning',
                icon: <ClockCircleOutlined />,
                text: 'قيد المعالجة',
                step: 0
            },
            completed: {
                color: 'success',
                icon: <CheckCircleOutlined />,
                text: 'مكتمل',
                step: 2
            },
            cancelled: {
                color: 'error',
                icon: <CloseCircleOutlined />,
                text: 'ملغي',
                step: 0
            }
        };
        return statusMap[status] || statusMap.pending;
    };

    const itemsColumns: ColumnsType<SalesOrderItem> = [
        {
            title: '#',
            key: 'index',
            width: 60,
            render: (_, __, index) => index + 1,
        },
        {
            title: 'المنتج',
            dataIndex: ['product', 'name'],
            key: 'product',
            render: (name, record) => (
                <div>
                    <div style={{ fontWeight: 500 }}>{name || 'منتج'}</div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        SKU: {record.product?.sku || '-'}
                    </Text>
                </div>
            ),
        },
        {
            title: 'الكمية',
            dataIndex: 'quantity',
            key: 'quantity',
            align: 'center',
            render: (qty) => <Tag color="blue" style={{ fontSize: 14, fontWeight: 600 }}>{qty}</Tag>,
        },
        {
            title: 'سعر الوحدة',
            dataIndex: 'unit_price',
            key: 'unit_price',
            render: (price) => (
                <span style={{ fontWeight: 500 }}>
                    {(price || 0).toLocaleString()} جنيه
                </span>
            ),
        },
        {
            title: 'الإجمالي',
            dataIndex: 'total',
            key: 'total',
            render: (total) => (
                <span style={{ fontWeight: 600, color: '#52c41a', fontSize: 15 }}>
                    {(total || 0).toLocaleString()} جنيه
                </span>
            ),
        },
    ];

    if (!order) {
        return <div>جاري التحميل...</div>;
    }

    const statusInfo = getStatusInfo(order.status);

    return (
        <div>
            <Space style={{ marginBottom: 24 }}>
                <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/sales')}>
                    رجوع للمبيعات
                </Button>
            </Space>

            <Row gutter={[16, 16]}>
                {/* Order Header */}
                <Col span={24}>
                    <Card>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <Title level={2} style={{ margin: 0 }}>
                                    طلب رقم #{String(order.id).padStart(5, '0')}
                                </Title>
                                <Space style={{ marginTop: 8 }}>
                                    <CalendarOutlined />
                                    <Text type="secondary">
                                        {dayjs(order.order_date).format('YYYY/MM/DD')}
                                    </Text>
                                </Space>
                            </div>
                            <Tag
                                color={statusInfo.color}
                                icon={statusInfo.icon}
                                style={{ fontSize: 16, padding: '8px 16px', fontWeight: 500 }}
                            >
                                {statusInfo.text}
                            </Tag>
                        </div>
                    </Card>
                </Col>

                {/* Statistics */}
                <Col xs={24} sm={12} lg={8}>
                    <Card>
                        <Statistic
                            title="إجمالي الطلب"
                            value={order.total_amount}
                            prefix={<DollarOutlined />}
                            suffix="جنيه"
                            valueStyle={{ color: '#3f8600', fontSize: 28 }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <Card>
                        <Statistic
                            title="عدد الأصناف"
                            value={order.items?.length || 0}
                            valueStyle={{ color: '#1890ff', fontSize: 28 }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <Card>
                        <Statistic
                            title="متوسط سعر الصنف"
                            value={order.items?.length ? Math.round(order.total_amount / order.items.length) : 0}
                            suffix="جنيه"
                            valueStyle={{ fontSize: 28 }}
                        />
                    </Card>
                </Col>

                {/* Order Timeline */}
                <Col xs={24} lg={8}>
                    <Card title="مراحل الطلب" style={{ height: '100%' }}>
                        <Steps
                            direction="vertical"
                            current={statusInfo.step}
                            status={order.status === 'cancelled' ? 'error' : 'process'}
                            items={[
                                {
                                    title: 'تم إنشاء الطلب',
                                    description: dayjs(order.created_at).format('YYYY/MM/DD HH:mm')
                                },
                                {
                                    title: 'قيد المعالجة'
                                },
                                {
                                    title: 'مكتمل'
                                }
                            ]}
                        />
                    </Card>
                </Col>

                {/* Customer Info */}
                <Col xs={24} lg={16}>
                    <Card title="معلومات العميل">
                        <Descriptions bordered column={2}>
                            <Descriptions.Item label="الاسم" span={2}>
                                <Space>
                                    <UserOutlined />
                                    <strong>{order.customer?.name || 'غير محدد'}</strong>
                                </Space>
                            </Descriptions.Item>
                            <Descriptions.Item label="الكود">
                                {order.customer?.code || '-'}
                            </Descriptions.Item>
                            <Descriptions.Item label="الهاتف">
                                {order.customer?.phone || '-'}
                            </Descriptions.Item>
                            <Descriptions.Item label="البريد الإلكتروني" span={2}>
                                {order.customer?.email || '-'}
                            </Descriptions.Item>
                            <Descriptions.Item label="العنوان" span={2}>
                                {order.customer?.address || '-'}
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                </Col>

                {/* Order Items */}
                <Col span={24}>
                    <Card title="تفاصيل الأصناف">
                        <Table
                            columns={itemsColumns}
                            dataSource={order.items || []}
                            rowKey="id"
                            pagination={false}
                            loading={loading}
                            summary={(data) => {
                                const total = data.reduce((sum, item) => sum + (item.total || 0), 0);
                                return (
                                    <Table.Summary fixed>
                                        <Table.Summary.Row style={{ background: '#fafafa' }}>
                                            <Table.Summary.Cell index={0} colSpan={4} align="right">
                                                <strong style={{ fontSize: 16 }}>الإجمالي الكلي:</strong>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={1}>
                                                <strong style={{ fontSize: 18, color: '#52c41a' }}>
                                                    {total.toLocaleString()} جنيه
                                                </strong>
                                            </Table.Summary.Cell>
                                        </Table.Summary.Row>
                                    </Table.Summary>
                                );
                            }}
                        />
                    </Card>
                </Col>

                {/* Activity Timeline */}
                <Col span={24}>
                    <Card title="سجل الأنشطة">
                        <Timeline
                            items={[
                                {
                                    color: 'green',
                                    children: (
                                        <>
                                            <p><strong>تم إنشاء الطلب</strong></p>
                                            <p style={{ color: '#8c8c8c', fontSize: 12 }}>
                                                {dayjs(order.created_at).format('YYYY/MM/DD HH:mm')}
                                            </p>
                                        </>
                                    ),
                                },
                                ...(order.status === 'completed' ? [{
                                    color: 'blue',
                                    children: (
                                        <>
                                            <p><strong>تم إكمال الطلب</strong></p>
                                            <p style={{ color: '#8c8c8c', fontSize: 12 }}>
                                                {dayjs(order.created_at).format('YYYY/MM/DD HH:mm')}
                                            </p>
                                        </>
                                    ),
                                }] : []),
                                ...(order.status === 'cancelled' ? [{
                                    color: 'red',
                                    children: (
                                        <>
                                            <p><strong>تم إلغاء الطلب</strong></p>
                                            <p style={{ color: '#8c8c8c', fontSize: 12 }}>
                                                {dayjs(order.created_at).format('YYYY/MM/DD HH:mm')}
                                            </p>
                                        </>
                                    ),
                                }] : []),
                            ]}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

import { Card, Typography, Row, Col, Statistic, Tabs } from 'antd';
import {
    DollarOutlined, ShoppingOutlined,
    UserOutlined, InboxOutlined,
    RiseOutlined, FallOutlined
} from '@ant-design/icons';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

const { Title } = Typography;

export default function ReportsPage() {
    // Mock data
    const salesTrendData = [
        { month: 'يناير', revenue: 45000, profit: 12000 },
        { month: 'فبراير', revenue: 52000, profit: 15000 },
        { month: 'مارس', revenue: 48000, profit: 13500 },
        { month: 'أبريل', revenue: 61000, profit: 18000 },
        { month: 'مايو', revenue: 55000, profit: 16000 },
        { month: 'يونيو', revenue: 67000, profit: 21000 },
    ];

    const topProductsData = [
        { product: 'منتج A', sales: 4500 },
        { product: 'منتج B', sales: 3800 },
        { product: 'منتج C', sales: 3200 },
        { product: 'منتج D', sales: 2900 },
        { product: 'منتج E', sales: 2400 },
    ];

    const customerGrowthData = [
        { month: 'يناير', new: 45, active: 320 },
        { month: 'فبراير', new: 52, active: 365 },
        { month: 'مارس', new: 48, active: 405 },
        { month: 'أبريل', new: 61, active: 458 },
        { month: 'مايو', new: 55, active: 505 },
        { month: 'يونيو', new: 67, active: 564 },
    ];

    const salesContent = (
        <>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="مبيعات الشهر"
                            value={245000}
                            prefix={<DollarOutlined />}
                            suffix="جنيه"
                            // @ts-ignore
                            formatter={(value) => <span style={{ color: '#3f8600' }}>{value}</span>}
                        />
                        <div style={{ marginTop: 8, color: '#3f8600' }}>
                            <RiseOutlined /> 12.5% عن الشهر الماضي
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="عدد الطلبات"
                            value={356}
                            prefix={<ShoppingOutlined />}
                            // @ts-ignore
                            formatter={(value) => <span style={{ color: '#1890ff' }}>{value}</span>}
                        />
                        <div style={{ marginTop: 8, color: '#1890ff' }}>
                            <RiseOutlined /> 8.2% عن الشهر الماضي
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="متوسط قيمة الطلب"
                            value={688}
                            prefix={<DollarOutlined />}
                            suffix="جنيه"
                        />
                        <div style={{ marginTop: 8, color: '#cf1322' }}>
                            <FallOutlined /> 3.1% عن الشهر الماضي
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="صافي الربح"
                            value={98000}
                            prefix={<DollarOutlined />}
                            suffix="جنيه"
                            // @ts-ignore
                            formatter={(value) => <span style={{ color: '#722ed1' }}>{value}</span>}
                        />
                        <div style={{ marginTop: 8, color: '#722ed1' }}>
                            <RiseOutlined /> 15.3% عن الشهر الماضي
                        </div>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                <Col xs={24}>
                    <Card title="اتجاه المبيعات والأرباح">
                        <ResponsiveContainer width="100%" height={350}>
                            <LineChart data={salesTrendData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#1890ff"
                                    strokeWidth={2}
                                    name="الإيرادات"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="profit"
                                    stroke="#52c41a"
                                    strokeWidth={2}
                                    name="الأرباح"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                <Col xs={24}>
                    <Card title="أفضل المنتجات مبيعاً">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={topProductsData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="product" type="category" width={100} />
                                <Tooltip />
                                <Bar dataKey="sales" fill="#1890ff" name="المبيعات" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>
        </>
    );

    const inventoryContent = (
        <>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={8}>
                    <Card>
                        <Statistic
                            title="إجمالي المنتجات"
                            value={1234}
                            prefix={<InboxOutlined />}
                            // @ts-ignore
                            formatter={(value) => <span style={{ color: '#1890ff' }}>{value}</span>}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <Card>
                        <Statistic
                            title="قيمة المخزون"
                            value={567890}
                            prefix={<DollarOutlined />}
                            suffix="جنيه"
                            // @ts-ignore
                            formatter={(value) => <span style={{ color: '#3f8600' }}>{value}</span>}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <Card>
                        <Statistic
                            title="منتجات منخفضة المخزون"
                            value={23}
                            // @ts-ignore
                            formatter={(value) => <span style={{ color: '#faad14' }}>{value}</span>}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                <Col xs={24}>
                    <Card title="حركة المخزون">
                        <div style={{
                            height: 300,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: '#fafafa',
                            borderRadius: 8
                        }}>
                            <Typography.Text type="secondary">
                                سيتم إضافة تقارير المخزون التفصيلية قريباً
                            </Typography.Text>
                        </div>
                    </Card>
                </Col>
            </Row>
        </>
    );

    const customersContent = (
        <>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={8}>
                    <Card>
                        <Statistic
                            title="إجمالي العملاء"
                            value={892}
                            prefix={<UserOutlined />}
                            // @ts-ignore
                            formatter={(value) => <span style={{ color: '#1890ff' }}>{value}</span>}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <Card>
                        <Statistic
                            title="عملاء نشطين"
                            value={654}
                            prefix={<UserOutlined />}
                            // @ts-ignore
                            formatter={(value) => <span style={{ color: '#3f8600' }}>{value}</span>}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <Card>
                        <Statistic
                            title="عملاء VIP"
                            value={45}
                            // @ts-ignore
                            formatter={(value) => <span style={{ color: '#722ed1' }}>{value}</span>}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                <Col xs={24}>
                    <Card title="نمو قاعدة العملاء">
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={customerGrowthData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="new" fill="#1890ff" name="عملاء جدد" />
                                <Bar dataKey="active" fill="#52c41a" name="عملاء نشطين" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>
        </>
    );

    const items = [
        { key: 'sales', label: 'تقارير المبيعات', children: salesContent },
        { key: 'inventory', label: 'تقارير المخزون', children: inventoryContent },
        { key: 'customers', label: 'تقارير العملاء', children: customersContent },
    ];

    return (
        <div>
            <Title level={2} style={{ marginBottom: 24 }}>التقارير والإحصائيات</Title>
            <Tabs defaultActiveKey="sales" size="large" items={items} />
        </div>
    );
}

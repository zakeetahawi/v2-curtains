import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Statistic, Row, Col, Button, Typography } from 'antd';
import {
    ArrowLeftOutlined,
    UserOutlined,
    DollarOutlined,
    ShoppingOutlined,
} from '@ant-design/icons';
import { branchService } from '../services/branch.service';

const { Title } = Typography;

export default function BranchDashboardPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            fetchDashboard();
        }
    }, [id]);

    const fetchDashboard = async () => {
        setLoading(true);
        try {
            const response = await branchService.getDashboard(Number(id));
            if (response.success && response.data) {
                setStats(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch dashboard');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/branches')}>
                    رجوع للفروع
                </Button>
            </div>

            <Title level={2} style={{ marginBottom: 24 }}>
                {stats?.branch_name || 'Dashboard الفرع'}
            </Title>

            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <Card loading={loading}>
                        <Statistic
                            title="إجمالي العملاء"
                            value={stats?.total_customers || 0}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: '#1890ff', fontSize: 24 }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card loading={loading}>
                        <Statistic
                            title="إجمالي الطلبات"
                            value={stats?.total_orders || 0}
                            prefix={<ShoppingOutlined />}
                            valueStyle={{ color: '#52c41a', fontSize: 24 }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card loading={loading}>
                        <Statistic
                            title="إجمالي المبيعات"
                            value={stats?.total_sales || 0}
                            prefix={<DollarOutlined />}
                            suffix="جنيه"
                            valueStyle={{ color: '#faad14', fontSize: 24 }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card loading={loading}>
                        <Statistic
                            title="إيرادات الشهر"
                            value={stats?.monthly_revenue || 0}
                            prefix={<DollarOutlined />}
                            suffix="جنيه"
                            valueStyle={{ color: '#722ed1', fontSize: 24 }}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                <Col span={24}>
                    <Card title="إحصائيات تفصيلية">
                        <div style={{
                            height: 300,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: '#fafafa',
                            borderRadius: 8
                        }}>
                            <Typography.Text type="secondary">
                                سيتم إضافة الرسوم البيانية التفصيلية قريباً
                            </Typography.Text>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

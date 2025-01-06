import { Card } from "@/components/ui/card";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { format } from 'date-fns';
import { AlertCircle, AlertOctagon, Check, Clock } from "lucide-react";

interface PaymentCardProps {
  annualPaymentStatus?: 'completed' | 'pending' | 'due' | 'overdue';
  emergencyCollectionStatus?: 'completed' | 'pending' | 'due' | 'overdue';
  emergencyCollectionAmount?: number;
  annualPaymentDueDate?: string;
  emergencyCollectionDueDate?: string;
  lastAnnualPaymentDate?: string;
  lastEmergencyPaymentDate?: string;
  lastAnnualPaymentAmount?: number;
  lastEmergencyPaymentAmount?: number;
}

const PaymentCard = ({ 
  annualPaymentStatus = 'pending',
  emergencyCollectionStatus = 'pending',
  emergencyCollectionAmount = 0,
  annualPaymentDueDate,
  emergencyCollectionDueDate,
  lastAnnualPaymentDate,
  lastEmergencyPaymentDate,
  lastAnnualPaymentAmount,
  lastEmergencyPaymentAmount
}: PaymentCardProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    try {
      return format(new Date(dateString), 'MMM do, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#0EA5E9'; // Ocean Blue for paid
      case 'due':
        return '#F97316'; // Bright Orange for due
      case 'overdue':
        return '#ea384c'; // Red for overdue
      case 'pending':
        return '#8B5CF6'; // Purple for pending
      default:
        return '#8B5CF6';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="h-6 w-6" />;
      case 'due':
        return <Clock className="h-6 w-6" />;
      case 'overdue':
        return <AlertOctagon className="h-6 w-6" />;
      case 'pending':
        return <AlertCircle className="h-6 w-6" />;
      default:
        return <AlertCircle className="h-6 w-6" />;
    }
  };

  return (
    <Card className="dashboard-card">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Annual Payment Section */}
        <div className="p-6 glass-card rounded-lg">
          <h3 className="text-lg font-medium text-white mb-4">Annual Payment</h3>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-2xl font-bold text-white">£40</p>
              <p className="text-sm font-bold" style={{ color: getStatusColor(annualPaymentStatus) }}>
                Due: {formatDate(annualPaymentDueDate)}
              </p>
              {lastAnnualPaymentDate && (
                <div className="mt-2">
                  <p className="text-xs text-dashboard-muted">
                    Last payment: {formatDate(lastAnnualPaymentDate)}
                  </p>
                  {lastAnnualPaymentAmount && (
                    <p className="text-xs text-dashboard-accent3">
                      Amount: £{lastAnnualPaymentAmount}
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="w-16 h-16" style={{ color: getStatusColor(annualPaymentStatus) }}>
              {getStatusIcon(annualPaymentStatus)}
            </div>
          </div>
          <div className="text-sm text-dashboard-text">
            {annualPaymentStatus === 'completed' 
              ? 'Payment completed' 
              : (
                <div className="space-y-1">
                  <p>Payment {annualPaymentStatus}</p>
                  <p className="text-dashboard-muted">
                    {annualPaymentStatus === 'overdue' 
                      ? 'Please complete your overdue payment immediately'
                      : 'Please complete your payment before the due date'}
                  </p>
                </div>
              )}
          </div>
        </div>

        {/* Emergency Collection Section */}
        <div className="p-6 glass-card rounded-lg">
          <h3 className="text-lg font-medium text-white mb-4">Emergency Collection</h3>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-2xl font-bold text-white">
                £{emergencyCollectionAmount}
              </p>
              <p className="text-sm font-bold" style={{ color: getStatusColor(emergencyCollectionStatus) }}>
                Due: {formatDate(emergencyCollectionDueDate)}
              </p>
              {lastEmergencyPaymentDate && (
                <div className="mt-2">
                  <p className="text-xs text-dashboard-muted">
                    Last payment: {formatDate(lastEmergencyPaymentDate)}
                  </p>
                  {lastEmergencyPaymentAmount && (
                    <p className="text-xs text-dashboard-accent3">
                      Amount: £{lastEmergencyPaymentAmount}
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="w-16 h-16" style={{ color: getStatusColor(emergencyCollectionStatus) }}>
              {getStatusIcon(emergencyCollectionStatus)}
            </div>
          </div>
          <div className="text-sm text-dashboard-text">
            {emergencyCollectionStatus === 'completed' 
              ? 'Payment completed' 
              : (
                <div className="space-y-1">
                  <p>Payment {emergencyCollectionStatus}</p>
                  <p className="text-dashboard-muted">
                    {emergencyCollectionStatus === 'overdue'
                      ? 'Emergency collection payment is overdue'
                      : 'One-time emergency collection payment required'}
                  </p>
                </div>
              )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PaymentCard;
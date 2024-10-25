import React, { useState, useEffect } from 'react';
import { i18n } from '@osd/i18n';
import { I18nProvider } from '@osd/i18n/react';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  EuiButton,
  EuiButtonEmpty,
  EuiCallOut,
  EuiFlexGroup,
  EuiFlexItem,
  EuiHealth,
  EuiIcon,
  EuiLoadingSpinner,
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageHeader,
  EuiPanel,
  EuiProgress,
  EuiSideNav,
  EuiSpacer,
  EuiStat,
  EuiBadge,
  EuiText,
  EuiTitle,
  EuiToolTip,
  EuiGlobalToastList,
  EuiCard,
} from '@elastic/eui';
import { CoreStart } from '../../../../src/core/public';
import { NavigationPublicPluginStart } from '../../../../src/plugins/navigation/public';
import { PLUGIN_ID, PLUGIN_NAME } from '../../common';

interface SecurityComponentStatus {
  name: string;
  status: string;
  lastUpdate: string;
  detections: number;
  cpu: number;
  memory: number;
  scanning: boolean;
  threat_level: 'low' | 'medium' | 'high' | 'critical';
  events_today: number;
}

interface MranvAppDeps {
  basename: string;
  notifications: CoreStart['notifications'];
  http: CoreStart['http'];
  navigation: NavigationPublicPluginStart;
}

export const MranvApp = ({ basename, notifications, http, navigation }: MranvAppDeps) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedItemId, setSelectedItemId] = useState<string>('overview');
  const [toasts, setToasts] = useState<Array<{ title: string; color: string }>>([]);
  const [lastUpdateTime, setLastUpdateTime] = useState<string>(new Date().toLocaleString());
  const [scanProgress, setScanProgress] = useState<number>(0);

  const [componentStatuses, setComponentStatuses] = useState<SecurityComponentStatus[]>([
    {
      name: 'Endpoint Detection & Response',
      status: 'active',
      lastUpdate: new Date().toLocaleString(),
      detections: 156,
      cpu: 12,
      memory: 24,
      scanning: true,
      threat_level: 'high',
      events_today: 45
    },
    {
      name: 'User Behavior Analytics',
      status: 'active',
      lastUpdate: new Date().toLocaleString(),
      detections: 89,
      cpu: 8,
      memory: 16,
      scanning: false,
      threat_level: 'medium',
      events_today: 28
    },
    {
      name: 'Host-Based Intrusion Detection System',
      status: 'active',
      lastUpdate: new Date().toLocaleString(),
      detections: 234,
      cpu: 15,
      memory: 32,
      scanning: true,
      threat_level: 'critical',
      events_today: 67
    },
    {
      name: 'Signature-Based Malware Detection & Scanning Engine',
      status: 'active',
      lastUpdate: new Date().toLocaleString(),
      detections: 45,
      cpu: 18,
      memory: 28,
      scanning: true,
      threat_level: 'low',
      events_today: 12
    },
    {
      name: 'NGAV + EDR',
      status: 'active',
      lastUpdate: new Date().toLocaleString(),
      detections: 167,
      cpu: 14,
      memory: 22,
      scanning: false,
      threat_level: 'high',
      events_today: 89
    },
    {
      name: 'LLM Malware Detection',
      status: 'active',
      lastUpdate: new Date().toLocaleString(),
      detections: 78,
      cpu: 25,
      memory: 45,
      scanning: true,
      threat_level: 'medium',
      events_today: 34
    }
  ]);

  const analyticsData = {
    daily_detections: [
      { date: '2024-10-19', count: 145 },
      { date: '2024-10-20', count: 162 },
      { date: '2024-10-21', count: 157 },
      { date: '2024-10-22', count: 189 },
      { date: '2024-10-23', count: 142 },
      { date: '2024-10-24', count: 134 },
      { date: '2024-10-25', count: 178 }
    ],
    recent_events: [
      {
        timestamp: '2024-10-25T10:45:23',
        type: 'Malware Detection',
        component: 'NGAV + EDR',
        severity: 'High',
        status: 'Blocked'
      },
      {
        timestamp: '2024-10-25T10:42:15',
        type: 'Suspicious Activity',
        component: 'User Behavior Analytics',
        severity: 'Medium',
        status: 'Investigating'
      },
      {
        timestamp: '2024-10-25T10:38:56',
        type: 'Policy Violation',
        component: 'HIDS',
        severity: 'Low',
        status: 'Resolved'
      },
      {
        timestamp: '2024-10-25T10:35:30',
        type: 'Ransomware Attempt',
        component: 'EDR',
        severity: 'Critical',
        status: 'Blocked'
      },
      {
        timestamp: '2024-10-25T10:32:12',
        type: 'Data Exfiltration',
        component: 'LLM Detection',
        severity: 'High',
        status: 'Investigating'
      }
    ]
  };

  useEffect(() => {
    // Simulate initial loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setComponentStatuses(prev => prev.map(component => ({
        ...component,
        detections: component.scanning ? component.detections + Math.floor(Math.random() * 3) : component.detections,
        cpu: Math.min(100, component.cpu + (Math.random() * 6 - 3)),
        memory: Math.min(100, component.memory + (Math.random() * 4 - 2)),
        lastUpdate: new Date().toLocaleString(),
        events_today: component.scanning ? component.events_today + Math.floor(Math.random() * 2) : component.events_today
      })));

      // Simulate scan progress
      setScanProgress(prev => (prev + 2) % 100);

      // Add random toast messages
      if (Math.random() < 0.3) {
        const newToast = {
          title: `New threat detected by ${componentStatuses[Math.floor(Math.random() * componentStatuses.length)].name}`,
          color: 'danger'
        };
        setToasts(prev => [...prev, newToast]);
        setTimeout(() => setToasts(prev => prev.filter(t => t !== newToast)), 3000);
      }

      setLastUpdateTime(new Date().toLocaleString());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const renderOverview = () => (
    <EuiPageBody>
      <EuiPageHeader>
        <EuiTitle size="l">
          <h1>
            <EuiIcon type="securityApp" size="xl" />{' '}
            OpenArmor Security Dashboard
          </h1>
        </EuiTitle>
      </EuiPageHeader>

      <EuiSpacer />

      <EuiCallOut
        title="System Security Status"
        color="success"
        iconType="checkInCircleFilled"
      >
        <p>All security components are operational. Last update: {lastUpdateTime}</p>
      </EuiCallOut>

      <EuiSpacer />

      <EuiPanel>
        <EuiTitle size="xs">
          <h3>Active Security Scan</h3>
        </EuiTitle>
        <EuiSpacer size="s" />
        <EuiProgress
          value={scanProgress}
          max={100}
          size="s"
          color="success"
        />
        <EuiText size="xs" color="subdued">
          <p>Progress: {scanProgress}%</p>
        </EuiText>
      </EuiPanel>

      <EuiSpacer />

      <EuiFlexGroup wrap>
        {componentStatuses.map((component, index) => (
          <EuiFlexItem key={index} style={{ minWidth: '350px' }}>
            <EuiPanel>
              <EuiFlexGroup alignItems="center" gutterSize="s">
                <EuiFlexItem>
                  <EuiTitle size="xs">
                    <h4>{component.name}</h4>
                  </EuiTitle>
                  <EuiSpacer size="s" />
                  <EuiFlexGroup alignItems="center" gutterSize="s">
                    <EuiFlexItem grow={false}>
                      <EuiHealth color="success">{component.status}</EuiHealth>
                    </EuiFlexItem>
                    <EuiFlexItem grow={false}>
                      <EuiToolTip content="CPU Usage">
                        <EuiBadge color={component.cpu > 80 ? 'danger' : 'primary'}>
                          CPU: {Math.round(component.cpu)}%
                        </EuiBadge>
                      </EuiToolTip>
                    </EuiFlexItem>
                    <EuiFlexItem grow={false}>
                      <EuiToolTip content="Memory Usage">
                        <EuiBadge color={component.memory > 80 ? 'danger' : 'warning'}>
                          MEM: {Math.round(component.memory)}%
                        </EuiBadge>
                      </EuiToolTip>
                    </EuiFlexItem>
                  </EuiFlexGroup>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <EuiStat
                    title={component.detections.toString()}
                    description="Detections"
                    textAlign="right"
                    titleColor={component.detections > 100 ? 'danger' : 'primary'}
                  />
                </EuiFlexItem>
              </EuiFlexGroup>
              {component.scanning && (
                <>
                  <EuiSpacer size="s" />
                  <EuiProgress size="xs" color="accent" />
                  <EuiText size="xs" color="subdued">
                    <p>Active scan in progress...</p>
                  </EuiText>
                </>
              )}
            </EuiPanel>
          </EuiFlexItem>
        ))}
      </EuiFlexGroup>
    </EuiPageBody>
  );

  const renderAnalytics = () => (
    <EuiPageBody>
      <EuiPageHeader>
        <EuiTitle size="l">
          <h1>
            <EuiIcon type="visArea" size="xl" />{' '}
            Security Analytics
          </h1>
        </EuiTitle>
      </EuiPageHeader>

      <EuiSpacer />

      <EuiFlexGroup>
        <EuiFlexItem>
          <EuiPanel>
            <EuiTitle size="s">
              <h2>Detection Trends (Last 7 Days)</h2>
            </EuiTitle>
            <EuiSpacer />
            <EuiFlexGroup>
              {analyticsData.daily_detections.map((data, idx) => (
                <EuiFlexItem key={idx}>
                  <div style={{ height: '200px', position: 'relative' }}>
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        width: '100%',
                        background: '#006BB4',
                        height: `${(data.count / 200) * 100}%`,
                        borderRadius: '4px 4px 0 0',
                      }}
                    />
                  </div>
                  <EuiText size="xs" textAlign="center">
                    <p>{new Date(data.date).toLocaleDateString('en-US', { weekday: 'short' })}</p>
                    <p>{data.count}</p>
                  </EuiText>
                </EuiFlexItem>
              ))}
            </EuiFlexGroup>
          </EuiPanel>
        </EuiFlexItem>
      </EuiFlexGroup>

      <EuiSpacer />

      <EuiPanel>
        <EuiTitle size="s">
          <h2>Recent Security Events</h2>
        </EuiTitle>
        <EuiSpacer />
        <table style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Event Type</th>
              <th>Component</th>
              <th>Severity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {analyticsData.recent_events.map((event, idx) => (
              <tr key={idx}>
                <td>{new Date(event.timestamp).toLocaleString()}</td>
                <td>{event.type}</td>
                <td>{event.component}</td>
                <td>
                  <EuiBadge color={
                    event.severity === 'Critical' ? 'danger' :
                    event.severity === 'High' ? 'warning' :
                    event.severity === 'Medium' ? 'primary' : 'success'
                  }>
                    {event.severity}
                  </EuiBadge>
                </td>
                <td>
                  <EuiHealth color={event.status === 'Blocked' ? 'success' : 'warning'}>
                    {event.status}
                  </EuiHealth>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </EuiPanel>
    </EuiPageBody>
  );

  const renderComponentDetails = () => (
    <EuiPageBody>
      <EuiPageHeader>
        <EuiTitle size="l">
          <h1>
            <EuiIcon type="apps" size="xl" />{' '}
            Security Components
          </h1>
        </EuiTitle>
      </EuiPageHeader>

      <EuiSpacer />

      {componentStatuses.map((component, idx) => (

        <React.Fragment key={idx}>
          <EuiPanel>
            <EuiFlexGroup>
              <EuiFlexItem>
                <EuiTitle size="s">
                  <h2>{component.name}</h2>
                </EuiTitle>
                <EuiSpacer size="s" />
                <EuiFlexGroup alignItems="center" gutterSize="s">
                  <EuiFlexItem grow={false}>
                    <EuiHealth color={component.status === 'active' ? 'success' : 'danger'}>
                      {component.status.toUpperCase()}
                    </EuiHealth>
                  </EuiFlexItem>
                  <EuiFlexItem grow={false}>
                    <EuiBadge color={
                      component.threat_level === 'critical' ? 'danger' :
                      component.threat_level === 'high' ? 'warning' :
                      component.threat_level === 'medium' ? 'primary' : 'success'
                    }>
                      Threat Level: {component.threat_level.toUpperCase()}
                    </EuiBadge>
                  </EuiFlexItem>
                </EuiFlexGroup>
                <EuiSpacer />

                <EuiFlexGroup>
                  <EuiFlexItem>
                    <EuiPanel hasShadow={false} hasBorder>
                      <EuiTitle size="xs">
                        <h3>Resource Utilization</h3>
                      </EuiTitle>
                      <EuiSpacer size="s" />
                      <EuiText size="s">
                        <p>CPU Usage</p>
                      </EuiText>
                      <EuiProgress
                        value={component.cpu}
                        max={100}
                        size="s"
                        color={component.cpu > 80 ? 'danger' : 'primary'}
                      />
                      <EuiText size="xs" color="subdued">
                        <p>{Math.round(component.cpu)}%</p>
                      </EuiText>

                      <EuiSpacer size="s" />

                      <EuiText size="s">
                        <p>Memory Usage</p>
                      </EuiText>
                      <EuiProgress
                        value={component.memory}
                        max={100}
                        size="s"
                        color={component.memory > 80 ? 'danger' : 'primary'}
                      />
                      <EuiText size="xs" color="subdued">
                        <p>{Math.round(component.memory)}%</p>
                      </EuiText>
                    </EuiPanel>
                  </EuiFlexItem>

                  <EuiFlexItem>
                    <EuiPanel hasShadow={false} hasBorder>
                      <EuiTitle size="xs">
                        <h3>Activity Metrics</h3>
                      </EuiTitle>
                      <EuiSpacer size="s" />
                      <EuiFlexGroup>
                        <EuiFlexItem>
                          <EuiStat
                            title={component.detections.toString()}
                            description="Total Detections"
                            titleColor={component.detections > 100 ? 'danger' : 'primary'}
                            textAlign="center"
                          />
                        </EuiFlexItem>
                        <EuiFlexItem>
                          <EuiStat
                            title={component.events_today.toString()}
                            description="Events Today"
                            titleColor={component.events_today > 50 ? 'danger' : 'primary'}
                            textAlign="center"
                          />
                        </EuiFlexItem>
                      </EuiFlexGroup>
                    </EuiPanel>
                  </EuiFlexItem>
                </EuiFlexGroup>

                <EuiSpacer size="s" />

                <EuiPanel hasShadow={false} hasBorder>
                  <EuiTitle size="xs">
                    <h3>Status Information</h3>
                  </EuiTitle>
                  <EuiSpacer size="s" />
                  <EuiText size="s">
                    <dl>
                      <dt>Last Update</dt>
                      <dd>{component.lastUpdate}</dd>
                      <dt>Scanning Status</dt>
                      <dd>
                        {component.scanning ? (
                          <>
                            <EuiHealth color="success">Active Scan in Progress</EuiHealth>
                            <EuiSpacer size="s" />
                            <EuiProgress size="xs" color="accent" />
                          </>
                        ) : (
                          <EuiHealth color="subdued">Idle</EuiHealth>
                        )}
                      </dd>
                    </dl>
                  </EuiText>
                </EuiPanel>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiPanel>
          <EuiSpacer />
        </React.Fragment>
      ))}
    </EuiPageBody>
  );

  const renderContent = () => {
    switch (selectedItemId) {
      case 'analytics':
        return renderAnalytics();
      case 'components':
        return renderComponentDetails();
      default:
        return renderOverview();
    }
  };

  if (isLoading) {
    return (
      <EuiFlexGroup alignItems="center" justifyContent="center" style={{ height: '100vh' }}>
        <EuiFlexItem grow={false}>
          <EuiLoadingSpinner size="xl" />
        </EuiFlexItem>
      </EuiFlexGroup>
    );
  }

  return (
    <Router basename={basename}>
      <I18nProvider>
        <>
          <navigation.ui.TopNavMenu
            appName={PLUGIN_ID}
            showSearchBar={true}
            useDefaultBehaviors={true}
          />
          <EuiPage>
            <EuiFlexGroup>
              <EuiFlexItem grow={false} style={{ width: '250px' }}>
                <EuiSideNav
                  items={[
                    {
                      name: 'OpenArmor Security',
                      id: 'openarmor-security',
                      items: [
                        {
                          name: 'Overview',
                          id: 'overview',
                          icon: <EuiIcon type="dashboardApp" />,
                          onClick: () => setSelectedItemId('overview'),
                          isSelected: selectedItemId === 'overview',
                        },
                        {
                          name: 'Components',
                          id: 'components',
                          icon: <EuiIcon type="apps" />,
                          onClick: () => setSelectedItemId('components'),
                          isSelected: selectedItemId === 'components',
                        },
                        {
                          name: 'Analytics',
                          id: 'analytics',
                          icon: <EuiIcon type="visArea" />,
                          onClick: () => setSelectedItemId('analytics'),
                          isSelected: selectedItemId === 'analytics',
                        },
                      ],
                    },
                  ]}
                />
              </EuiFlexItem>

              <EuiFlexItem>
                {renderContent()}
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiPage>

          <EuiGlobalToastList
            toasts={toasts.map((toast, idx) => ({
              id: idx.toString(),
              title: toast.title,
              color: toast.color,
            }))}
            dismissToast={() => setToasts([])}
            toastLifeTimeMs={3000}
          />
        </>
      </I18nProvider>
    </Router>
  );
};

export default MranvApp;

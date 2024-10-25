import React, { useState, useEffect } from 'react';
import { i18n } from '@osd/i18n';
import { FormattedMessage, I18nProvider } from '@osd/i18n/react';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  EuiButton,
  EuiSmallButton,
  EuiHorizontalRule,
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageContentHeader,
  EuiPageHeader,
  EuiTitle,
  EuiText,
  EuiSpacer,
  EuiPanel,
  EuiFlexGroup,
  EuiFlexItem,
  EuiLoadingSpinner,
} from '@elastic/eui';
import { CoreStart } from '../../../../src/core/public';
import { NavigationPublicPluginStart } from '../../../../src/plugins/navigation/public';
import { PLUGIN_ID, PLUGIN_NAME } from '../../common';

interface MranvAppDeps {
  basename: string;
  notifications: CoreStart['notifications'];
  http: CoreStart['http'];
  navigation: NavigationPublicPluginStart;
}

// Replace with your Giphy API key
const GIPHY_API_KEY = 'XduomGh8H5KPNVT2rCMs7JSTWtCzh5WW';

interface GiphyResponse {
  data: {
    embed_url: string;
    id: string;
  };
}

export const MranvApp = ({ basename, notifications, http, navigation }: MranvAppDeps) => {
  const [timestamp, setTimestamp] = useState<string | undefined>();
  const [gifUrl, setGifUrl] = useState<string>('https://giphy.com/embed/13ByqbM0hgfN7y');
  const [gifId, setGifId] = useState<string>('13ByqbM0hgfN7y');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchRandomDogGif = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/random?api_key=${GIPHY_API_KEY}&tag=dog&rating=g`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch GIF');
      }

      const data: GiphyResponse = await response.json();
      setGifUrl(data.data.embed_url);
      setGifId(data.data.id);

      notifications.toasts.addSuccess(
        i18n.translate('mranv.gifUpdated', {
          defaultMessage: 'New dog GIF loaded!',
        })
      );
    } catch (error) {
      notifications.toasts.addError(new Error('Failed to fetch dog GIF'), {
        title: 'Error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onClickHandler = () => {
    http.get('/api/mranv/example').then((res) => {
      setTimestamp(res.time);
      notifications.toasts.addSuccess(
        i18n.translate('mranv.dataUpdated', {
          defaultMessage: 'Data updated',
        })
      );
    });
  };

  // Fetch a random dog GIF when component mounts
  useEffect(() => {
    fetchRandomDogGif();
  }, []);

  return (
    <Router basename={basename}>
      <I18nProvider>
        <>
          <navigation.ui.TopNavMenu
            appName={PLUGIN_ID}
            showSearchBar={true}
            useDefaultBehaviors={true}
          />
          <EuiPage restrictWidth="1000px">
            <EuiPageBody component="main">
              <EuiPageHeader>
                <EuiTitle size="l">
                  <h1>
                    <FormattedMessage
                      id="mranv.helloWorldText"
                      defaultMessage="{name}"
                      values={{ name: PLUGIN_NAME }}
                    />
                  </h1>
                </EuiTitle>
              </EuiPageHeader>

              <EuiPageContent>
                <EuiPageContentHeader>
                  <EuiTitle>
                    <h2>
                      <FormattedMessage
                        id="mranv.congratulationsTitle"
                        defaultMessage="Congratulations, you have successfully created a new OpenSearch Dashboards Plugin!"
                      />
                    </h2>
                  </EuiTitle>
                </EuiPageContentHeader>
                <EuiPageContentBody>
                  <EuiFlexGroup>
                    <EuiFlexItem>
                      <EuiText>
                        <p>
                          <FormattedMessage
                            id="mranv.content"
                            defaultMessage="Look through the generated code and check out the plugin development documentation."
                          />
                        </p>
                        <EuiHorizontalRule />
                        <p>
                          <FormattedMessage
                            id="mranv.timestampText"
                            defaultMessage="Last timestamp: {time}"
                            values={{ time: timestamp ? timestamp : 'Unknown' }}
                          />
                        </p>
                        <EuiButton type="primary" size="s" onClick={onClickHandler}>
                          <FormattedMessage id="mranv.buttonText" defaultMessage="Get data" />
                        </EuiButton>
                      </EuiText>
                    </EuiFlexItem>

                    <EuiFlexItem>
                      <div style={{ maxWidth: '480px', margin: '0 auto' }}>
                        {isLoading ? (
                          <div style={{ height: '480px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <EuiLoadingSpinner size="xl" />
                          </div>
                        ) : (
                          <>
                            <iframe
                              src={gifUrl}
                              width="100%"
                              height="480"
                              frameBorder="0"
                              className="giphy-embed"
                              allowFullScreen
                              title="Random Dog GIF"
                            />
                            <EuiSpacer size="s" />
                            <EuiFlexGroup justifyContent="center" alignItems="center">
                              <EuiFlexItem grow={false}>
                                <EuiButton
                                  size="s"
                                  onClick={fetchRandomDogGif}
                                  iconType="refresh"
                                  isLoading={isLoading}
                                >
                                  Get New Dog GIF
                                </EuiButton>
                              </EuiFlexItem>
                              <EuiFlexItem grow={false}>
                                <EuiText size="xs">
                                  <a
                                    href={`https://giphy.com/gifs/${gifId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    via GIPHY
                                  </a>
                                </EuiText>
                              </EuiFlexItem>
                            </EuiFlexGroup>
                          </>
                        )}
                      </div>
                    </EuiFlexItem>
                  </EuiFlexGroup>
                </EuiPageContentBody>
              </EuiPageContent>

              <EuiSpacer size="l" />

              <EuiPageContent>
                <EuiPageContentHeader>
                  <EuiTitle>
                    <h2>Dashboard Overview</h2>
                  </EuiTitle>
                </EuiPageContentHeader>
                <EuiPageContentBody>
                  <EuiPanel>
                    <EuiText>
                      <h3>Welcome to the Custom Dashboard</h3>
                      <p>
                        This section can be customized to show your specific dashboard content,
                        metrics, or any other information you'd like to display.
                      </p>
                    </EuiText>
                  </EuiPanel>
                </EuiPageContentBody>
              </EuiPageContent>
            </EuiPageBody>
          </EuiPage>
        </>
      </I18nProvider>
    </Router>
  );
};

// eslint-disable-next-line import/no-unresolved
import { useLocation } from '@gatsbyjs/reach-router';
import React, {
  useRef,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  Container, Content, Row, Col, List, Button, Sidebar, Grid, FlexboxGrid, Divider, IconButton,
} from 'rsuite';

import Context from '../../../utils/context';
import { useWindowSize, useSiteMetadata } from '../../../utils/hooks';
import Utils from '../../../utils/pageUtils.mjs';
import Affix from '../../Affix';
import Icon from '../../Icon';
import IconListItem from '../../IconListItem';
import LoadableTableOfContents from '../../TableOfContents/loadable';

import * as style from './sidebar.module.less';

const Name = () => {
  const siteMetadata = useSiteMetadata();
  const arr = siteMetadata.author.split(' ');
  const firstName = arr.slice(0, arr.length - 1)
    .join(' ');
  const lastName = arr[arr.length - 1];
  return (
    <FlexboxGrid>
      <FlexboxGrid.Item as={Col} xs={24}>
        <h2 className="centerAlign">
          {firstName}
          &nbsp;
          <span>{lastName}</span>
        </h2>
      </FlexboxGrid.Item>
      {siteMetadata.authorAlternative ? (
        <FlexboxGrid.Item as={Col} xs={24}>
          <h3 className="centerAlign">{siteMetadata.authorAlternative}</h3>
        </FlexboxGrid.Item>
      ) : null}
    </FlexboxGrid>
  );
};

const VISITOR_COUNT_STORAGE_KEY = 'gatsby-academic-visitor-count';
const VISITOR_COUNT_CACHE_TIMESTAMP_KEY = 'gatsby-academic-visitor-count-updated-at';
const VISITOR_COUNT_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const VISITOR_COUNT_ENDPOINT = process.env.GATSBY_VISITOR_COUNT_ENDPOINT
  || 'https://vincent-tiono.github.io/hit';

const formatOrdinal = (value) => {
  const mod10 = value % 10;
  const mod100 = value % 100;
  if (mod10 === 1 && mod100 !== 11) return `${value}st`;
  if (mod10 === 2 && mod100 !== 12) return `${value}nd`;
  if (mod10 === 3 && mod100 !== 13) return `${value}rd`;
  return `${value}th`;
};

const UserInfo = () => {
  const siteMetadata = useSiteMetadata();
  const [visitorCount, setVisitorCount] = useState(() => {
    if (typeof window === 'undefined') {
      return null;
    }
    // Get locally stored visit count
    const stored = localStorage.getItem(VISITOR_COUNT_STORAGE_KEY);
    return stored ? parseInt(stored, 10) : null;
  });
  
  const [debugMode, setDebugMode] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const sessionKey = 'gatsby-academic-session';

    const readCachedCount = () => {
      const storedCount = localStorage.getItem(VISITOR_COUNT_STORAGE_KEY);
      if (storedCount === null) {
        return null;
      }

      const parsed = parseInt(storedCount, 10);
      return Number.isFinite(parsed) ? parsed : null;
    };

    const updateCachedCount = (count) => {
      localStorage.setItem(VISITOR_COUNT_STORAGE_KEY, count.toString());
      localStorage.setItem(VISITOR_COUNT_CACHE_TIMESTAMP_KEY, Date.now().toString());
      setVisitorCount(count);
    };

    const sendGoogleAnalytics = (count) => {
      if (typeof window.gtag === 'function') {
        console.log('📈 Sending GA event: new_visitor with value', count);
        window.gtag('event', 'new_visitor', {
          'event_category': 'engagement',
          'value': count
        });
      } else {
        console.log('⚠️ Google Analytics gtag not available');
      }
    };

    const fetchGlobalCount = async (method) => {
      try {
        const response = await fetch(VISITOR_COUNT_ENDPOINT, {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
        });

        if (!response.ok) {
          throw new Error(`Unexpected status ${response.status}`);
        }

        const payload = await response.json();
        if (payload && typeof payload.value === 'number' && Number.isFinite(payload.value)) {
          console.log('🌐 Synced global visitor count:', payload.value);
          updateCachedCount(payload.value);
          return payload.value;
        }

        throw new Error('Malformed response payload');
      } catch (error) {
        console.error('❌ Failed to sync visitor count with API:', error);
        return null;
      }
    };

    const initializeCounter = async () => {
      console.log('🔢 Initializing visitor counter...');

      const cachedCount = readCachedCount();
      const cachedTimestampRaw = localStorage.getItem(VISITOR_COUNT_CACHE_TIMESTAMP_KEY);
      const cachedTimestamp = cachedTimestampRaw ? parseInt(cachedTimestampRaw, 10) : null;

      if (typeof cachedCount === 'number') {
        console.log('📊 Cached count found:', cachedCount);
        setVisitorCount(cachedCount);
      }

      const currentSession = sessionStorage.getItem(sessionKey);
      const isNewSession = !currentSession;

      console.log('🔑 Current session:', currentSession);

      if (isNewSession) {
        const optimisticCount = (cachedCount ?? 0) + 1;
        updateCachedCount(optimisticCount);
        sessionStorage.setItem(sessionKey, 'active');

        console.log('✅ New session detected! Optimistic count:', optimisticCount);
        sendGoogleAnalytics(optimisticCount);

        const syncedCount = await fetchGlobalCount('POST');
        if (syncedCount === null) {
          console.log('💾 Falling back to local optimistic count.');
        }
        return;
      }

      console.log('🔄 Existing session detected.');

      const cacheStale = !cachedTimestamp || (Date.now() - cachedTimestamp) > VISITOR_COUNT_CACHE_DURATION;
      if (cacheStale) {
        console.log('🕒 Cache stale or missing, fetching current global count...');
        const syncedCount = await fetchGlobalCount('GET');
        if (syncedCount === null) {
          console.log('⚠️ Could not refresh global count, using cached value.');
        }
      } else if (cachedCount === null) {
        console.log('ℹ️ No cached count available, will attempt to fetch.');
        const syncedCount = await fetchGlobalCount('GET');
        if (syncedCount === null) {
          console.log('⚠️ Could not fetch global count, count remains null.');
        }
      } else {
        console.log('🗄️ Using cached visitor count:', cachedCount);
      }
    };

    // Initialize on mount
    initializeCounter();
  }, []);

  const visitorMessage = visitorCount !== null && visitorCount > 0
    ? `It's your ${formatOrdinal(visitorCount)} visit, welcome!`
    : 'Welcome! 👋';

  const clearTestData = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(VISITOR_COUNT_STORAGE_KEY);
      localStorage.removeItem(VISITOR_COUNT_CACHE_TIMESTAMP_KEY);
      sessionStorage.removeItem('gatsby-academic-session');
      window.location.reload();
    }
  };

  return (
    <>
      <div className={`${style.name} centerAlign`}>
        <Row type="flex">
          <Col
            xs={24}
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <span
              className={`${style.badge} ${style.badgeGray}`}
              style={{ 
                fontStyle: 'italic', 
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'inline-block',
                minWidth: 'fit-content'
              }}
              onClick={() => setDebugMode(!debugMode)}
              title="Click to toggle debug info"
            >
              {visitorMessage}
            </span>
            {debugMode && (
              <div style={{
                fontSize: '10px',
                background: '#f0f0f0',
                padding: '8px',
                margin: '5px 0',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}>
                <div>Count: {visitorCount}</div>
                <div>Stored: {typeof window !== 'undefined' ? localStorage.getItem(VISITOR_COUNT_STORAGE_KEY) : 'N/A'}</div>
                <div>Updated: {typeof window !== 'undefined' ? localStorage.getItem(VISITOR_COUNT_CACHE_TIMESTAMP_KEY) : 'N/A'}</div>
                <div>Session: {typeof window !== 'undefined' ? (sessionStorage.getItem('gatsby-academic-session') ? 'Active' : 'New') : 'N/A'}</div>
                <button 
                  onClick={clearTestData}
                  style={{ fontSize: '10px', padding: '2px 5px', marginTop: '5px' }}
                >
                  Reset Counter
                </button>
              </div>
            )}
          </Col>
          {siteMetadata.professions.map((profession) => (
            <Col
              key={profession}
              xs={24}
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <span className={`${style.badge} ${style.badgeGray}`}>{profession}</span>
            </Col>
          ))}
        </Row>
        <div className="centerAlign box" style={{ marginTop: '0.5rem' }}>
          <FlexboxGrid>
            {siteMetadata.social.map((social) => (
              <FlexboxGrid.Item as={Col} key={social.url} className={style.iconButtonCol}>
                <IconButton
                  className={style.iconButton}
                  size="sm"
                  appearance="subtle"
                  icon={(
                    <a
                      href={social.url}
                      target="_blank"
                      label="button"
                      rel="noopener noreferrer"
                    >
                      <Icon size="lg" fixedWidth icon={social.icon} />
                    </a>
                  )}
                />
              </FlexboxGrid.Item>
            ))}
          </FlexboxGrid>
        </div>
        <div
          style={{
            width: 'auto',
            minWidth: '200px',
            maxWidth: '300px',
            marginBottom: '-0.5rem',
          }}
        >
          {siteMetadata.birthday
            ? (
              <IconListItem icon="calendar" title={siteMetadata.birthday} />
            ) : null}
          {siteMetadata.location
            ? (
              <IconListItem icon="map-marker-alt" title={siteMetadata.location} />
            ) : null}
          {siteMetadata.email
            ? (
              <IconListItem icon="envelope" title={<a href={`mailto:${siteMetadata.email}`}>{siteMetadata.email}</a>} />
            ) : null}
        </div>
      </div>
    </>
  );
};

const DomContent = (props) => {
  const siteMetadata = useSiteMetadata();
  const mainSidebar = useRef(null);
  const context = useContext(Context);
  const { pathname } = props;
  // console.log(context);
  return (
    <Sidebar>
      <div ref={mainSidebar}>
        <img
          className={`${style.profileAvatar} centerAlign`}
          src={Utils.generateFullUrl(siteMetadata, siteMetadata.avatar)}
          alt=""
        />
        <div className={`${style.name} ${style.boxName} centerAlign`}>
          <Name />
        </div>
        {context && context.state && context.state.tableOfContents
        && context.state.pathname === pathname
          ? (
            <>
              <Divider />
              <LoadableTableOfContents
                tableOfContents={context.state.tableOfContents}
                mainSidebar={mainSidebar}
              />
            </>
          ) : <UserInfo />}
      </div>
      {/* <div className={style.resumeDownload}> */}
      {/*  <a href="../resume.pdf" target="_blank">Download CV</a> */}
      {/* </div> */}
    </Sidebar>
  );
};

const SidebarWrapper = (props) => {
  const [width] = useWindowSize();
  const { children } = props;
  const { pathname } = useLocation();
  let domContent = <DomContent pathname={pathname} />;
  if (width >= 992) {
    domContent = (
      <Affix top={100}>
        <DomContent pathname={pathname} />
      </Affix>
    );
  }
  if (width < 480) {
    domContent = <></>;
    if (pathname === '/') {
      domContent = <DomContent pathname={pathname} />;
    }
  }
  return (
    <>
      <Container className={`${style.content}`}>
        <Content className={`${style.content}`}>
          <FlexboxGrid style={{ marginBottom: '4rem' }}>
            <FlexboxGrid.Item as={Col} xs={24} sm={24} md={8} lg={7} className={style.sidebarContent}>
              {domContent}
            </FlexboxGrid.Item>
            <FlexboxGrid.Item as={Col} xs={24} sm={24} md={16} lg={17}>
              <Container className={`${style.boxContent} borderRadiusSection`}>
                {children}
              </Container>
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </Content>
      </Container>
    </>
  );
};

export const Sidebar404 = (props) => {
  const { children } = props;
  return (
    <Container>
      <Content className={`${style.content}`}>
        <Row type="flex">
          <Col sm={24} md={24} lg={24}>
            <Container className={`${style.boxContent} ${style.sideBar404Radius}`}>
              {children}
            </Container>
          </Col>
        </Row>
      </Content>
    </Container>
  );
};

export default SidebarWrapper;

// Future enhancement: Netlify/Vercel Function to get GA data
// This would be deployed as a serverless function

const { google } = require('googleapis');

exports.handler = async (event, context) => {
  try {
    // Initialize Google Analytics API
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GA_CREDENTIALS),
      scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
    });

    const analytics = google.analyticsreporting({ version: 'v4', auth });

    // Get page views for the last 30 days
    const response = await analytics.reports.batchGet({
      reportRequests: [
        {
          viewId: process.env.GA_VIEW_ID,
          dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
          metrics: [{ expression: 'ga:pageviews' }],
        },
      ],
    });

    const pageViews = response.data.reports[0].data.totals[0].values[0];

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ visits: parseInt(pageViews) }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch analytics data' }),
    };
  }
};
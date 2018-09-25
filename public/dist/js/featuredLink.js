
$(function () {
  // Prepare GraphQL query.
  const bentoApiURL = 'https://staging.newsdigitalapi.com';

  /**
   * Determine method to retrieve metadata.
   *
   * Internal links will be searched with the Bento API.
   * External links will be scraped for metadata.
   */
  function retrieveMetadata(pastedData = '') {
    const variables = {
      filters: `url:"${pastedData}"`,
    };

    const query = `query getFeaturedLinkInfo($filters:String) {
        search(filters: $filters) {
          items {
            ... on Article {
              type
              url {
                primary
              }
              headline {
                primary
              }
              description {
                primary
              }
              teaseImage {
                url {
                  primary
                }
              }
              taxonomy {
                primarySection {
                  name
                }
              }
            }
            ... on Video {
              type
              url {
                primary
              }
              headline {
                primary
              }
              description {
                primary
              }
              teaseImage {
                url {
                  primary
                }
              }
              taxonomy {
                primarySection {
                  name
                }
              }
            }
            ... on Slideshow {
              type
              url {
                primary
              }
              headline {
                primary
              }
              description {
                primary
              }
              teaseImage {
                url {
                  primary
                }
              }
              taxonomy {
                primarySection {
                  name
                }
              }
            }
            ... on Recipe {
              type
              url {
                primary
              }
              headline {
                primary
              }
              description {
                primary
              }
              teaseImage {
                url {
                  primary
                }
              }
              taxonomy {
                primarySection {
                  name
                }
              }
            }
          }
        }
      }`;

    const body = JSON.stringify({
      query,
      operationName: 'getFeaturedLinkInfo',
      variables,
    });
    console.log(body);
    fetch(bentoApiURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body,
    })
      .then(resp => resp.json())
      .then((data) => {
        if (data.data.search.items.length !== 0 && typeof data.data.search.items[0].url !== 'undefined') {
          console.log(data.data.search.items[0]);
          return data.data.search.items[0];
        }
        console.log('no bento result.');
        return false;
      })
      .catch((e) => {
        console.error(e);
        // If a Bento API lookup fails, attempt to retrieve data as external link.
      });
  }

  // Run GraphQL query on the paste event.
  $('#json_nid').bind('paste', (event) => {
    const pastedData = event.originalEvent.clipboardData.getData('text');
    retrieveMetadata(pastedData);
  });
}());

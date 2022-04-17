import React, {useState} from 'react';
import axios from 'axios';
import {PageLayout, BaseStyles, Box, Heading, Button, useColorSchemeVar} from '@primer/react';

import Input from './Input';
import Info from './Info';
import Switch from './Switch';

export default () => {
    const [domains, setDomains] = useState({});
    const [info, setInfo] = useState(undefined);

    const customBg = useColorSchemeVar({
      light: '#fff',
      dark_dimmed: '#000'
    });


    const search = async () => {
        const list = Object.values(domains).map(d => {
           return d.value;
        });

        setInfo(null);
        const { data } = await axios.post("/api/check_multi", {
            list,
        }, {});
        setInfo(undefined);

        setDomains(domains => {
            let newDomains = {};
            for (const domain in domains) {
                newDomains[domain] = {...domains[domain], res: data[domains[domain].value]};

                if (newDomains[domain]?.res?.available) {
                    newDomains[domain].ref.parentElement.parentElement.querySelector('.info svg').style.color = '#71cd5b';
                } else {
                  newDomains[domain].ref.parentElement.parentElement.querySelector('.info svg').style.color = '#bd2a2a';
                }
            }
           return {...newDomains};
        });
    };

    return (
      <BaseStyles>
        <Box bg={customBg} style={{height: '100%', minHeight: '100vh'}}>
          <PageLayout containerWidth="large">
            <PageLayout.Header divider="line">
              <Box display="flex">
                <Box>
                  <Heading mb={2}><img src="/favicon.png" /> Multi Domain WHOIS Availability Checker</Heading>
                </Box>
                <Box flexGrow={1} style={{textAlign: 'right'}}>
                  <Switch />
                </Box>
              </Box>
            </PageLayout.Header>

            <PageLayout.Content width="small">
              <Box p={5} m={5}>
                <Input domains={domains} setDomains={setDomains} setInfo={setInfo} />
                <Box m={3}>
                  <Button variant="outline" onClick={search}>Search</Button>
                </Box>
              </Box>
            </PageLayout.Content>

            <PageLayout.Pane divider="line" width="large">

              <Box p={5} m={3}>
                <Info info={info} />
              </Box>
            </PageLayout.Pane>

            <PageLayout.Footer divider="line">
              <small>Built on Rails, React and Primer 🎉</small>
            </PageLayout.Footer>


          </PageLayout>
        </Box>
      </BaseStyles>
    );
};


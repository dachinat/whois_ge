import React, {useState} from 'react';
import axios from 'axios';
import {PageLayout, BaseStyles, Box, Heading, Button} from '@primer/react';

import Input from './Input';
import Info from './Info';

export default () => {
    const [domains, setDomains] = useState({});
    const [info, setInfo] = useState(undefined);

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
                    newDomains[domain].ref.parentElement.style.backgroundColor = '#7ad687';
                    newDomains[domain].ref.style.backgroundColor = '#7ad687';
                }
            }
           return {...newDomains};
        });
    };

    return (
      <BaseStyles>
          <PageLayout>
            <PageLayout.Header divider="line">
              <Heading mb={2}>GE Whois Multi Domain Checker</Heading>
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
              Made with React + Ruby on Rails
            </PageLayout.Footer>


          </PageLayout>
      </BaseStyles>
    );
};


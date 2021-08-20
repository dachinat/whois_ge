import React, {useState, useEffect, useRef} from 'react';

export default ({domains, setDomains, setInfo}) => {
    const [inputs, setInputs] = useState([]);
    const [selectedInput, setSelectedInput] = useState(null);

    let refs = useRef([]);

    useEffect(() => {
        addInput();
    }, []);

    useEffect(() => {
        setInfo(domains[selectedInput]?.res);
    }, [selectedInput, domains]);

    let count = 0;
    const refPos = {};

    const addInput = (currentKey = 0) => {
        count++;
        setInputs(inputs => {
            const input = refs.current[currentKey];
            if (input) {
                applyRegex(input);
            }

            let newInputs = [];
            inputs.forEach((input) => {

                newInputs.push(input);
                if (currentKey.toString() === input.key) {
                    newInputs.push(renderInput(count));
                }
            });

            if (inputs.length === 0) {
                newInputs.push(renderInput(count));
            }

            return [...newInputs];
        });
    };

    const removeInput = (key) => {
        goUp(key);

        setInputs(inputs => {
            if (inputs.length === 1) {
                return inputs;
            }
            let newInputs = [...inputs];
            newInputs = newInputs.filter(input => {
                return input.key !== key.toString()
            });

            return newInputs;
        });
    };

    const goUp = key => {
        setInputs(inputs =>{
            let tmp;
            inputs.every((item, index) => {
              if (parseInt(item.key) === key) {
                  return false;
              }
              tmp = parseInt(item.key);
              return true;
            });
            try {
                refs.current[refPos[tmp] || 1].focus();
            } catch (e) {}
            return [...inputs];
        });
    }

    const goDown = key => {
        setInputs(inputs => {

            let tmp;
            inputs.every((item, index) => {

               tmp = index;
               if (parseInt(item.key) === key) {
                   return false;
               }
               return true;
            });

            try {
                tmp = parseInt(inputs[tmp + 1].key) || undefined;
                refs.current[refPos[tmp]].focus();
            } catch(e) {
            }

            return [...inputs];
        });


        // let tmp;
        // refs.current.every((item, index) => {
        //     if (index > key && item !== null) {
        //         tmp = index;
        //         return false;
        //     }
        //     return true;
        // });
        // refs.current[tmp].focus();
    }

    const applyRegex = el => {
        let lastValue = el.value;

        let regex, match;

        // filter input
        regex = /[^A-Z|a-z|0-9|-|.|\r|\n]+/gm;
        if (el.value.match(regex)) {
            let result = el.value.replace(regex, '');
            el.value = result;
        }

        // replace double dots
        regex = /\.+/;
        if (el.value.match(regex)) {
            let result = el.value.replace(regex, '.');
            el.value = result;
        }

        // replace leading - and .
        regex = /^[-|.]+(.*)/m;
        if (el.value.match(regex)) {
            let result = el.value.replace(regex, '$1');
            el.value = result;
        }

        // add .ge
        if (el.value && el.value.match(/.+\.ge$/) === null) {
            let result = el.value.replace(/(.+)(?!\.ge(\n))/, '$1.ge$2');
            el.value = result;
        }

        //replace non .com.ge .edu.ge .net.ge .org.ge pvt.ge
        regex = /(.+)\.(?!com)(?!net)(?!edu)(?!org)(?!pvt)(.*)\.(.*)/;
        match = el.value.match(regex);
        if (match !== null) {
            let result = el.value.replace(regex, '$1.ge');
            el.value = result;
        }

        // make letters lowercase
        el.value = el.value.toLowerCase();

        // Dipatch change event
        let event = new Event('change', { bubbles: true });
        event.simulated = true;
        let tracker = el._valueTracker;
        if (tracker) {
            tracker.setValue(lastValue);
        }
        el.dispatchEvent(event);
    };

    const domainInfo = (key) => {
        console.log(domains[key]);
    };

    const renderInput = key => {
        return (
          <div key={key}>
              <div>
                  <input ref={el => {
                      refPos[key] = refs.current.length;
                      return refs.current[key] = el;
                  }} type="text"
                     onChange={e => {
                         e.target.style.backgroundColor = 'white';
                         setDomains(domains => ({...domains, [key]: {value: e.target.value, ref: refs.current[key]}}))
                     }}
                     onKeyDown={e => {
                      if (e.key === 'Enter') {
                          addInput(key);
                      } else if (e.key === 'Backspace') {
                          if (e.target.value === '') {
                              removeInput(key);
                              e.preventDefault();
                          }
                      } else if (e.key === 'ArrowUp') {
                          goUp(key);
                      } else if (e.key === 'ArrowDown') {
                          goDown(key);
                      }
                  }} onFocus={() => setSelectedInput(key)} autoFocus />
                  <span><button onClick={e => addInput(key)}>+</button></span>
                  <span>
                      <button onClick={e => refs.current[key].focus()}>i</button>
                  </span>
              </div>
          </div>
        );
    }

    return (
        <div>
            Use arrow and enter keys for navigation
            <div>
                {inputs}
            </div>
        </div>
    );
};
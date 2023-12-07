import React from 'react';
import {Col, Nav, Row, Tab} from 'react-bootstrap';

import styles from './Learn.module.css';

function ArrTable({arr}){
    return (
      <table style={{margin: "1rem"}}>
        <tbody>
          <tr>

          {
            arr.map((el,i) => (
              <td key={i} style={{border: ".1rem solid black", padding: ".25rem", width: "25px", height: "25px", textAlign: "center", fontSize: "16pt"}}>{el}</td>
              ))
            }
            </tr>
          </tbody>
      </table>
    )
}


export default function Learn() {
  return (
    <Tab.Container defaultActiveKey={"bubble"} id={styles.learntab}>
      <Row>
        <Col sm={2} id={styles.learn_col}>
          <Nav variant='pills' className={styles.learn_nav}>
            <Nav.Item>
              <Nav.Link eventKey={"bubble"}>Bubble Sort</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey={"insertion"}>Insertion Sort</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey={"selection"}>Selection Sort</Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col>
          <Tab.Content>
            <Tab.Pane eventKey={"bubble"}>
                <div className={styles.learn}>
                  <h3 className={styles.learn_head}>Bubble Sort</h3>
                  <div className={styles.explain}>
                      Bubble sort works by going through a list of numbers and "bubbling" up the largest number. Below are some graphics (courtesy of <a target='_blank' href='https://www.geeksforgeeks.org/bubble-sort/'>GeeksforGeeks.org</a>).
                      <h5>Step 1</h5>
                      You have an unsorted list of numbers [6,0,3,5]. You start at the beginning of the list, and you compare 6 and 0. If 6 is larger than 0 (YES!), you swap them. Then, you compare 6 and the next element, 3. Since 6 is still larger than 3, you swap again. 
                      Lastly, you compare 6 and 5, and swap them again.
                      <br />
                      <img src="../learn/bubble/1.png" alt="" width={"500px"}/>
                      <br />
                      At this point, the rightmost element of the list is now sorted. You now continue again from the beginning, comparing 0 and 3. Since 0 is not larger than 3, you do not swap them. 
                      Then, you compare 3 and 5. Since 3 is not larger than 5, you do not swap them either. Now the last two elements (5 and 6) are in correct sorted order<br />
                      <img src="../learn/bubble/2.png" alt="" width={"500px"}/>
                      <br />
                      Now you just repeat the same steps above until everything is sorted.
                      <br />
                      <img src="../learn/bubble/3.png" alt="" width={"500px"}/>
                      <br />
                  </div>
                </div>
            </Tab.Pane>

            <Tab.Pane eventKey={"insertion"}>
              <div className={styles.learn}>
                  <h3 className={styles.learn_head}>Insertion Sort</h3>
                  <div className={styles.explain}>
                    Insertion sort works by having two subarrays to work with. One where all of the elements are sorted and one unsorted. For the purposes of this explanation, let's assume we have an unsorted list of numbers [5,2,9,3,6].
                    <ArrTable arr={[5,2,9,3,6]} />

                    First, you compare the the first two numbers, in this case, 5 and 2. Since 5 is larger than 2, you swap them. Now, 2 is considered the first element in this "sorted" subarray.
                    <ArrTable arr={[2,5,9,3,6]} sortedLength={1}/>
                    Next, we compare 5 and 9, which are already in ascending order. Thus, 5 is now also in the sorted subarray.
                    <ArrTable arr={[2,5,9,3,6]} sortedLength={1}/>
                    After that, we compare 9 and 3, and since 9 is greater than 3, we swap them. However, this 3 is not in the correct position of the sorted subarray. Hence, we need to swap 3 until it is in the correct position of the sorted subarray (in this case, it only needs to be swapped once with 5). This gives the resultant array
                    <ArrTable arr={[2,3,5,9,6]} sortedLength={1}/>
                    Lastly, we compare 9 to the 6, and since 9 > 6, we swap them. This time, the 6 happens to be in the correct position of the sorted subarray, so no additional swaps are nesccarry. Since 9 is the last element, it must be in the correct sorted position. So the final output of the sort is:
                    <ArrTable arr={[2,3,5,6,9]} sortedLength={1}/>

                  </div>
                </div>

            </Tab.Pane>

            <Tab.Pane eventKey={"selection"}>
            <div className={styles.learn}>
                  <h3 className={styles.learn_head}>Selection Sort</h3>
                  <div className={styles.explain}>
                    Selection sort works by scanning the array for the minimum number, then swapping it to the front of the array. For the purposes of this explanation, let's assume we have an unsorted list of numbers [5,2,9,3,6].
                    <ArrTable arr={[5,2,9,3,6]} />

                    We take the first element, 5, and compare it to all the other numbers. We take note of the smallest number that is also less than 5. Then, we swap that number with 5. In this example, the smallest number is 2, so we swap 2 and 5.
                    <ArrTable arr={[2,5,9,3,6]} />
                    Now we continue from the first element of the array. So, just by conincidence, we are also finding the smallest number that is also smaller than 5, which is now 3. As a result, we swap 3 and 5.
                    <ArrTable arr={[2,3,9,5,6]} />
                    We continue the same step as above, but with 9. Since 5 happens to be the smallest unsorted element less than 9, we swap 9 and 5.
                    <ArrTable arr={[2,3,5,9,6]} />
                    Working with 9 again, since 6 is smaller than 9, we swap them. This produces the final sorted array:
                    <ArrTable arr={[2,3,5,6,9]} />

                  </div>
                </div>

            </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  )
}
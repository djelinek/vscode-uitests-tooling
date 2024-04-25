/**
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License", destination); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { assert, expect } from "chai";
import { ActivityBar, ViewControl } from 'vscode-uitests-tooling';

describe('ActivityBar', function () {
    this.timeout(60000);

    let activityBar: ActivityBar;

    beforeEach(() => {
        activityBar = new ActivityBar();
    });

    describe('getViewControl', async function () {
        it('existing control', async function () {
            const control = await activityBar.getViewControl('Explorer');
            expect(control).to.not.be.undefined;
        });

        it('non existing control', async function () {
            try {
                const _item = await activityBar.getViewControl('abc', 5000);
            }
            catch (e: any) {
                expect(e.toString()).contain('Could not find view control with name "abc"');
            }
        });

        it('zero timeout', async function () {
            try {
                const _control2 = await activityBar.getViewControl('Explorer', 0);
            }
            catch (e: any) {
                expect(e.toString()).contain("Cannot iterate more than 1 times.");
            }
        });
    });

    describe('getViewControls', async function () {
        it('all default controls are available', async function () {
            const expectedMinimalLength = 5;
            const expectedControls: string[] = ["Explorer", "Search", "Source Control", "Run and Debug", "Extensions"];

            const controls = await activityBar.getViewControls();
            const actualLength = controls.length;
            const titles = await Promise.all((controls).map((control: ViewControl) => control.getTitle()));

            expect(actualLength).to.be.at.least(expectedMinimalLength);

            for (let i = 0; i < expectedMinimalLength; i++) {
                assert.isTrue(titles.some((value: string) => value.startsWith(expectedControls[i])));
            }
        });
    });
});

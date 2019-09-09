import { expect } from "chai";
import { BasicTests } from "test/helper/Basic";
import { PassAudio } from "test/helper/PassAudio";
import { ONLINE_TESTING } from "test/helper/Supports"
import { Signal } from "Tone/signal/Signal";
import { Oscillator } from "Tone/source/oscillator/Oscillator";
import { Meter } from "./Meter";

describe("Meter", () => {

	BasicTests(Meter);

	context("Metering", () => {

		it("handles getter/setter as Object", () => {
			const meter = new Meter();
			const values = {
				smoothing : 0.2,
			};
			meter.set(values);
			expect(meter.get().smoothing).to.equal(0.2);
			meter.dispose();
		});

		it("can be constructed with the smoothing", () => {
			const meter = new Meter(0.5);
			expect(meter.smoothing).to.equal(0.5);
			meter.dispose();
		});

		it("can be constructed with an object", () => {
			const meter = new Meter({
				smoothing : 0.3,
			});
			expect(meter.smoothing).to.equal(0.3);
			meter.dispose();
		});

		it("passes the audio through", () => {
			return PassAudio((input) => {
				const meter = new Meter().toDestination();
				input.connect(meter);
			});
		});

		if (ONLINE_TESTING) {
			it("measures the rms incoming signal", (done) => {
				const meter = new Meter();
				const signal = new Signal(1).connect(meter);
				setTimeout(() => {
					expect(meter.getValue()).to.be.closeTo(1, 0.05);
					meter.dispose();
					signal.dispose();
					done();
				}, 400);
			});

			it("can get the rms level of the incoming signal", (done) => {
				const meter = new Meter();
				const osc = new Oscillator().connect(meter).start();
				osc.volume.value = -6;
				setTimeout(() => {
					expect(meter.getLevel()).to.be.closeTo(-9, 1);
					meter.dispose();
					osc.dispose();
					done();
				}, 400);
			});
		}
	});
});

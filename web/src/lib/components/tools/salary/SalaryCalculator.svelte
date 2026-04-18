<script lang="ts">
	let gross = $state(20000000);
	let dependents = $state(0);
	let region = $state(0); // 0: I, 1: II, 2: III, 3: IV
	let insuranceType = $state('official'); // 'official' | 'custom'
	let customInsuranceSalary = $state(20000000);

	const formatVND = (val: number) => {
		return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
	};

	// Logic constants 2026
	const BASE_SALARY = 2_340_000; 
	const REGIONAL_MIN = [5_310_000, 4_730_000, 4_140_000, 3_700_000];
	const MAX_BHXH_BHYT = BASE_SALARY * 20; // 46.800.000
	const PERSONAL_DEDUCTION = 15_500_000;
	const DEPENDENT_DEDUCTION = 6_200_000;

	// Computations
	let insuranceSalary = $derived(insuranceType === 'official' ? gross : customInsuranceSalary);
	let maxBHTN = $derived(REGIONAL_MIN[region] * 20);

	let bhxh = $derived(Math.min(insuranceSalary, MAX_BHXH_BHYT) * 0.08);
	let bhyt = $derived(Math.min(insuranceSalary, MAX_BHXH_BHYT) * 0.015);
	let bhtn = $derived(Math.min(insuranceSalary, maxBHTN) * 0.01);
	let totalInsurance = $derived(bhxh + bhyt + bhtn);

	let taxableIncome = $derived(Math.max(0, gross - totalInsurance - PERSONAL_DEDUCTION - (DEPENDENT_DEDUCTION * dependents)));

	// 5-bracket tax system 2026 (Luật 109/2025/QH15)
	let pit = $derived.by(() => {
		let t = taxableIncome;
		if (t <= 0) return 0;
		if (t <= 10_000_000) return t * 0.05;
		if (t <= 30_000_000) return t * 0.1 - 500_000;
		if (t <= 60_000_000) return t * 0.2 - 3_500_000;
		if (t <= 100_000_000) return t * 0.3 - 9_500_000;
		return t * 0.35 - 14_500_000;
	});

	let net = $derived(gross - totalInsurance - pit);

	$effect(() => {
		if (insuranceType === 'official') {
			customInsuranceSalary = gross;
		}
	});
</script>

<div class="glass-panel w-full overflow-hidden rounded-[2.5rem] shadow-2xl p-1 relative">
	<div class="bg-surface/60 relative z-10 w-full rounded-[2.4rem] backdrop-blur-3xl p-6 sm:p-10 text-sm">
		<div class="grid lg:grid-cols-2 gap-10">
			<!-- Input Section -->
			<div class="space-y-6">
				<div class="space-y-2">
					<label for="input-gross" class="font-bold text-[0.7rem] uppercase tracking-widest text-primary">Lương Gross (VNĐ)</label>
					<input 
						id="input-gross"
						type="number" 
						bind:value={gross} 
						class="w-full bg-white/50 dark:bg-black/20 border border-primary/20 dark:border-white/10 rounded-2xl px-5 py-3.5 outline-none focus:ring-4 focus:ring-primary/10 transition-all font-mono font-bold text-lg"
					/>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div class="space-y-2">
						<label for="input-dependents" class="font-bold text-[0.7rem] uppercase tracking-widest text-primary">Người phụ thuộc</label>
						<input 
							id="input-dependents"
							type="number" 
							bind:value={dependents} 
							min="0"
							class="w-full bg-white/50 dark:bg-black/20 border border-primary/20 dark:border-white/10 rounded-2xl px-5 py-3.5 outline-none focus:ring-4 focus:ring-primary/10 transition-all font-mono"
						/>
					</div>

					<div class="space-y-2">
						<label for="select-region" class="font-bold text-[0.7rem] uppercase tracking-widest text-primary">Vùng</label>
						<select 
							id="select-region"
							bind:value={region} 
							class="w-full bg-white/50 dark:bg-black/20 border border-primary/20 dark:border-white/10 rounded-2xl px-5 py-3.5 outline-none focus:ring-4 focus:ring-primary/10 transition-all font-mono"
						>
							<option value={0}>Vùng I</option>
							<option value={1}>Vùng II</option>
							<option value={2}>Vùng III</option>
							<option value={3}>Vùng IV</option>
						</select>
					</div>
				</div>

				<div class="space-y-3">
					<p class="font-bold text-[0.7rem] uppercase tracking-widest text-primary">Mức lương đóng bảo hiểm</p>
					<div class="flex items-center gap-6">
						<label class="flex items-center gap-2 cursor-pointer">
							<input type="radio" bind:group={insuranceType} value="official" class="accent-primary w-4 h-4" />
							<span class="text-sm font-medium opacity-80">Trên mức lương chính thức</span>
						</label>
						<label class="flex items-center gap-2 cursor-pointer">
							<input type="radio" bind:group={insuranceType} value="custom" class="accent-primary w-4 h-4" />
							<span class="text-sm font-medium opacity-80">Khác</span>
						</label>
					</div>
					{#if insuranceType === 'custom'}
						<input 
							type="number" 
							bind:value={customInsuranceSalary} 
							class="w-full bg-white/50 dark:bg-black/20 border border-primary/20 dark:border-white/10 rounded-2xl px-5 py-3.5 outline-none focus:ring-4 focus:ring-primary/10 transition-all font-mono font-bold mt-2"
						/>
					{/if}
				</div>

				<div class="p-5 bg-primary/5 dark:bg-blue-500/10 rounded-2xl border border-primary/10 dark:border-blue-500/10 mt-6 hidden lg:block">
					<p class="text-[0.7rem] text-primary dark:text-blue-400 font-medium leading-relaxed opacity-80 space-y-1">
						<span class="block">* Áp dụng Nghị quyết 110/2025: Giảm trừ bản thân 15,5trđ, PT 6,2trđ.</span>
						<span class="block">* Luật số 109/2025: Biểu thuế giảm từ 7 xuống 5 bậc.</span>
						<span class="block">* Lương tối thiểu vùng I 2026: 5.310.000đ.</span>
					</p>
				</div>
			</div>

			<!-- Output Section -->
			<div class="space-y-6 bg-white dark:bg-slate-900/80 border border-primary/10 dark:border-white/10 p-6 sm:p-8 rounded-3xl shadow-xl">
				<div class="flex flex-col sm:flex-row justify-between sm:items-end border-b border-slate-200 dark:border-slate-700/80 pb-6 gap-2">
					<span class="text-sm font-black tracking-widest text-slate-500 dark:text-slate-400 uppercase">Lương Thực Nhận (NET)</span>
					<span class="text-4xl sm:text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300 drop-shadow-sm">
						{formatVND(net)}
					</span>
				</div>

				<div class="space-y-3.5 font-mono text-sm border-b border-slate-200 dark:border-slate-700/80 pb-6 text-slate-700 dark:text-slate-300">
					<div class="flex justify-between items-center"><span class="text-slate-500 dark:text-slate-400">Lương GROSS</span><span class="font-bold text-base text-slate-900 dark:text-white">{formatVND(gross)}</span></div>
					
					<div class="flex justify-between text-red-600 dark:text-red-400/90 pl-2 border-l-2 border-red-100 dark:border-red-900/30"><span class="text-slate-500 dark:text-slate-400">Bảo hiểm xã hội (8%)</span><span>-{formatVND(bhxh)}</span></div>
					<div class="flex justify-between text-red-600 dark:text-red-400/90 pl-2 border-l-2 border-red-100 dark:border-red-900/30"><span class="text-slate-500 dark:text-slate-400">Bảo hiểm y tế (1.5%)</span><span>-{formatVND(bhyt)}</span></div>
					<div class="flex justify-between text-red-600 dark:text-red-400/90 pl-2 border-l-2 border-red-100 dark:border-red-900/30"><span class="text-slate-500 dark:text-slate-400">Bảo hiểm thất nghiệp (1%)</span><span>-{formatVND(bhtn)}</span></div>
					
					<div class="flex justify-between border-t border-dashed border-slate-200 dark:border-slate-700/80 pt-3 mt-3"><span class="font-medium text-slate-600 dark:text-slate-300">Thu nhập trước thuế</span><span class="font-bold text-slate-900 dark:text-white">{formatVND(gross - totalInsurance)}</span></div>
					
					<div class="flex justify-between text-emerald-600 dark:text-emerald-400/90 pl-2 border-l-2 border-emerald-100 dark:border-emerald-900/30"><span class="text-slate-500 dark:text-slate-400">Giảm trừ gia cảnh bản thân (15,5tr)</span><span>-{formatVND(PERSONAL_DEDUCTION)}</span></div>
					<div class="flex justify-between text-emerald-600 dark:text-emerald-400/90 pl-2 border-l-2 border-emerald-100 dark:border-emerald-900/30"><span class="text-slate-500 dark:text-slate-400">Giảm trừ phụ thuộc ({dependents} người)</span><span>-{formatVND(DEPENDENT_DEDUCTION * dependents)}</span></div>
					
					<div class="flex justify-between border-t border-dashed border-slate-200 dark:border-slate-700/80 pt-3 mt-3"><span class="font-medium text-slate-600 dark:text-slate-300">Thu nhập chịu thuế</span><span class="font-bold text-slate-900 dark:text-white">{formatVND(taxableIncome)}</span></div>
					
					<div class="flex justify-between items-center text-amber-600 dark:text-amber-400/90 bg-amber-50 dark:bg-amber-900/10 p-2.5 rounded-lg border border-amber-100 dark:border-amber-900/30 mt-2">
						<span class="font-semibold">Thuế Thu Nhập Cá Nhân</span>
						<span class="font-bold">-{formatVND(pit)}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="absolute -right-20 -top-20 size-80 rounded-full bg-primary/5 blur-[100px] pointer-events-none"></div>
</div>

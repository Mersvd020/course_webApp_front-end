'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, SlidersHorizontal, X, ArrowLeft, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { persianNumber, type CourseCategory, type CourseList } from '@/data/courses';
import CourseCard from './CourseCard';
import CourseServiceError from './CourseServiceError';

export type CatalogQuery = { search?: string; price?: string; sort?: string; page?: string; minPrice?: string; maxPrice?: string };

export default function Catalog({ query, list, categories, error }: { query: CatalogQuery; list: CourseList; categories: CourseCategory[]; error?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const update = (changes: CatalogQuery) => {
    const params = new URLSearchParams();
    Object.entries({ ...query, page: undefined, ...changes }).forEach(([key, value]) => { if (value) params.set(key, value); });
    router.push(`${pathname}${params.size ? `?${params}` : ''}`, { scroll: false });
  };
  const price = ['free', 'paid', 'under-million'].includes(query.price ?? '') ? query.price : '';
  const active = [
    { key: 'search', value: query.search },
    { key: 'price', value: price === 'free' ? 'رایگان' : price === 'paid' ? 'دوره‌های پولی' : price ? 'تا یک میلیون تومان' : undefined },
    { key: 'minPrice', value: query.minPrice ? `از ${persianNumber(Number(query.minPrice))} تومان` : undefined },
    { key: 'maxPrice', value: query.maxPrice ? `تا ${persianNumber(Number(query.maxPrice))} تومان` : undefined },
  ] as const;
  const activeCount = active.filter(item => item.value).length;
  const pageStart = Math.max(1, Math.min(list.page - 2, list.pageCount - 4));

  return <>
    <section className="catalog-banner"><div className="academy-container"><div className="breadcrumb"><Link href="/home">خانه</Link><ChevronLeft size={14} /><span>دوره‌های آموزشی</span></div><span className="eyebrow">روی خودت سرمایه‌گذاری کن</span><h1>یک مهارت تازه، <span>یک دنیای تازه.</span></h1><p>مسیر بعدی یادگیری‌ات را از بین دوره‌های کاربردی پیدا کن.</p><span className="catalog-spark" aria-hidden="true">✳</span></div></section>
    <div className="academy-container catalog-content">
      <form className="catalog-search" onSubmit={event => { event.preventDefault(); update({ search: String(new FormData(event.currentTarget).get('search') ?? '').trim() }); }}><Search size={21} /><input key={query.search} name="search" defaultValue={query.search ?? ''} placeholder="نام دوره یا عبارت مورد نظرت را جست‌وجو کن…" aria-label="جست‌وجوی دوره" /><button className="button button-primary button-small" type="submit">جست‌وجو<ArrowLeft size={16} /></button></form>
      <div className="catalog-layout">
        <aside className={`catalog-sidebar ${filtersOpen ? 'filters-open' : ''}`} id="course-filters">
          <div className="filter-heading"><h2><SlidersHorizontal size={18} />فیلتر دوره‌ها</h2><button onClick={() => router.push(pathname, { scroll: false })} disabled={!activeCount}>پاک کردن</button></div>
          <fieldset><legend>هزینه آموزش</legend>{[['', 'همه دوره‌ها'], ['free', 'رایگان'], ['paid', 'دوره‌های پولی'], ['under-million', 'تا یک میلیون تومان']].map(([value, label]) => <label className="filter-option" key={value}><input type="radio" name="price" checked={(price || '') === value} onChange={() => update({ price: value || undefined, minPrice: undefined, maxPrice: undefined })} /><span>{label}</span></label>)}</fieldset>
          <form className="course-price-range" onSubmit={event => { event.preventDefault(); const form = new FormData(event.currentTarget); update({ price: undefined, minPrice: String(form.get('minPrice') ?? ''), maxPrice: String(form.get('maxPrice') ?? '') }); }}>
            <strong>بازه قیمت (تومان)</strong><label>از<input key={query.minPrice ?? 'min'} name="minPrice" type="number" min="0" step="1" defaultValue={query.minPrice ?? ''} placeholder="۰" /></label><label>تا<input key={query.maxPrice ?? 'max'} name="maxPrice" type="number" min="0" step="1" defaultValue={query.maxPrice ?? ''} placeholder="بدون محدودیت" /></label><button className="button button-primary button-small" type="submit">اعمال بازه قیمت</button>
          </form>
          {categories.length > 0 && <div className="course-search-suggestions"><h3>پیشنهاد برای جست‌وجو</h3>{categories.map(category => <button key={category.id} onClick={() => update({ search: category.name })}>{category.name}<Search size={12} /></button>)}</div>}
          <div className="sidebar-tip"><BookOpen size={26} /><strong>هر حرفه‌ای، یک روز مبتدی بوده.</strong><p>یک موضوع انتخاب کن و مسیر یادگیری‌ات را شروع کن.</p></div>
        </aside>
        <section className="catalog-results" aria-label="نتایج دوره‌ها">
          <div className="results-toolbar"><p aria-live="polite">{error ? 'دریافت اطلاعات ناموفق بود' : <><strong>{persianNumber(activeCount ? list.courses.length : list.total)}</strong> {activeCount ? 'نتیجه در این صفحه' : 'دوره برای یادگیری'}</>}</p><div><button className="filter-toggle" onClick={() => setFiltersOpen(!filtersOpen)} aria-expanded={filtersOpen} aria-controls="course-filters"><SlidersHorizontal size={16} />فیلترها</button><label className="sort-label">مرتب‌سازی:<select value={query.sort ?? 'default'} onChange={event => update({ sort: event.target.value === 'default' ? undefined : event.target.value })} aria-label="مرتب‌سازی دوره‌ها"><option value="default">پیش‌فرض</option><option value="new">جدیدترین</option><option value="cheap">کمترین قیمت</option><option value="expensive">بیشترین قیمت</option></select></label></div></div>
          {activeCount > 0 && <div className="active-filters">{active.map(({ key, value }) => value && <button key={key} onClick={() => update({ [key]: undefined })}>{value}<X size={13} /></button>)}</div>}
          {error ? <CourseServiceError message={error} /> : list.courses.length ? <div className="course-grid catalog-grid">{list.courses.map(course => <CourseCard key={course.id} course={course} />)}</div> : <div className="empty-courses"><Search size={38} /><h2>هنوز دوره‌ای با این مشخصات پیدا نشد</h2><p>یک عبارت دیگر جست‌وجو کن یا فیلترها را تغییر بده.</p><button className="button button-primary" onClick={() => router.push(pathname, { scroll: false })}>نمایش همه دوره‌ها</button></div>}
          {!error && list.pageCount > 1 && <nav className="course-pagination" aria-label="صفحه‌بندی دوره‌ها"><button disabled={list.page <= 1} onClick={() => update({ page: String(list.page - 1) })} aria-label="صفحه قبل"><ChevronRight size={17} /></button>{Array.from({ length: Math.min(5, list.pageCount) }, (_, i) => pageStart + i).map(page => <button key={page} aria-current={list.page === page ? 'page' : undefined} className={list.page === page ? 'current' : ''} onClick={() => update({ page: String(page) })}>{persianNumber(page)}</button>)}<button disabled={list.page >= list.pageCount} onClick={() => update({ page: String(list.page + 1) })} aria-label="صفحه بعد"><ChevronLeft size={17} /></button></nav>}
        </section>
      </div>
    </div>
  </>;
}

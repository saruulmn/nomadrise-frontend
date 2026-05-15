import Link from 'next/link';
import { StarFilled, ClockCircleOutlined, CalendarOutlined } from '@ant-design/icons';
import { cohorts } from '@/lib/data/cohorts';
import { masterClasses } from '@/lib/data/masterClasses';
import { mentors } from '@/lib/data/mentors';
import ThumbnailCard from './ThumbnailCard';
import GridContainer from './GridContainer';

interface Props {
  lang: string;
}

export default function HomeContentSections({ lang }: Props) {
  const upcomingCohorts = cohorts.filter((c) => c.status === 'Upcoming');
  const featuredMasterClasses = masterClasses.slice(0, 10);
  const featuredMentors = mentors.slice(0, 10);

  const isMn = lang === 'mn';

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 space-y-16">

        {/* Coming Soon Cohorts */}
        {upcomingCohorts.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {isMn ? 'Удахгүй эхлэх курс' : 'Coming Soon Cohorts'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {isMn ? 'Бүртгэлийн эхлэхийг хүлээж байна' : 'Registration opening soon'}
                </p>
              </div>
              <Link
                href={`/${lang}/cohort`}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                {isMn ? 'Бүгдийг үзэх →' : 'View all →'}
              </Link>
            </div>
            <GridContainer>
              {upcomingCohorts.map((cohort) => (
                <ThumbnailCard
                  key={cohort.id}
                  href={`/${lang}/cohort/${cohort.id}`}
                  image={cohort.thumbnail}
                  imageAlt={cohort.name}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                      {isMn ? 'Удахгүй' : 'Coming Soon'}
                    </span>
                    {cohort.trending && (
                      <span className="text-xs font-semibold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full border border-violet-200">
                        🔥
                      </span>
                    )}
                  </div>
                  <p className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">{cohort.name}</p>
                  <div className="flex flex-wrap gap-1 my-1">
                    {cohort.categories.slice(0, 2).map((cat) => (
                      <span key={cat} className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{cat}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                    <CalendarOutlined />
                    <span>{new Date(cohort.startDate).toLocaleDateString(isMn ? 'mn-MN' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <img src={cohort.teachers[0].avatar} alt={cohort.teachers[0].name} className="w-4 h-4 rounded-full" />
                    <span className="truncate">{cohort.teachers[0].name}</span>
                  </div>
                </ThumbnailCard>
              ))}
            </GridContainer>
          </section>
        )}

        {/* Master Classes */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {isMn ? 'Мастер классууд' : 'Master Classes'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {isMn ? 'Мэргэжлийн онлайн сургалтууд' : 'Expert-led online courses'}
              </p>
            </div>
            <Link
              href={`/${lang}/masterclass`}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              {isMn ? 'Бүгдийг үзэх →' : 'View all →'}
            </Link>
          </div>
          <GridContainer>
            {featuredMasterClasses.map((mc) => (
              <ThumbnailCard
                key={mc.id}
                href={`/${lang}/masterclass/${mc.id}`}
                image={mc.thumbnail}
                imageAlt={mc.title}
              >
                <p className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">{mc.title}</p>
                <p className="text-xs text-gray-500 truncate">{mc.instructor}</p>
                <div className="flex flex-wrap gap-1 my-1">
                  {mc.categories.slice(0, 2).map((cat) => (
                    <span key={cat} className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{cat}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <ClockCircleOutlined />
                    <span>{mc.duration}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">
                    {mc.price === null ? (isMn ? 'Үнэгүй' : 'Free') : `$${mc.price}`}
                  </span>
                </div>
              </ThumbnailCard>
            ))}
          </GridContainer>
        </section>

        {/* Mentors */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {isMn ? 'Менторууд' : 'Mentors'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {isMn ? 'Туршлагатай мэргэжилтнүүдтэй холбогд' : 'Connect with experienced professionals'}
              </p>
            </div>
            <Link
              href={`/${lang}/mentor`}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              {isMn ? 'Бүгдийг үзэх →' : 'View all →'}
            </Link>
          </div>
          <GridContainer>
            {featuredMentors.map((mentor) => (
              <ThumbnailCard
                key={mentor.id}
                href={`/${lang}/mentor/${mentor.id}`}
                image={mentor.avatar}
                imageAlt={mentor.name}
                isAvatar
              >
                <p className="font-semibold text-gray-900 truncate">{mentor.name}</p>
                <p className="text-sm text-gray-500 truncate">{mentor.title}</p>
                <div className="flex flex-wrap gap-1 my-1">
                  {mentor.skills.slice(0, 3).map((s) => (
                    <span key={s} className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{s}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1">
                    <StarFilled className="text-yellow-400 text-xs" />
                    <span className="text-sm font-medium text-gray-700">{mentor.rating}</span>
                    <span className="text-xs text-gray-400">({mentor.reviewCount})</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">${mentor.price}/mo</span>
                </div>
              </ThumbnailCard>
            ))}
          </GridContainer>
        </section>

      </div>
    </div>
  );
}

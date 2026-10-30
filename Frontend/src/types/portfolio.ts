export interface ResourceMeter {
  id: string;
  name: string;
  category: string;
  current: string;
  max: string;
  percentage: number;
  icon: string;
  color: 'primary' | 'secondary' | 'tertiary';
}

export interface SkillUnit {
  id: string;
  name: string;
  code: string;
  isIcon?: boolean;
  rank: string;
  level: number;
  description: string;
  metricLabel: string;
  metricValue: number;
  colorType: 'primary' | 'secondary' | 'tertiary' | 'primary-fixed';
}

export interface SkillCategory {
  id: string;
  name: string;
  subtitle: string;
  tierBadge: string;
  elementBadge?: string;
  elementColor?: string;
  troopName?: string;
  troopImage?: string;
  icon: string;
  themeColor: 'primary' | 'secondary' | 'tertiary' | 'primary-fixed' | 'purple' | 'orange';
  skills: SkillUnit[];
}

export interface ProjectCampaign {
  id: string;
  title: string;
  questNumber: number;
  category: string;
  description: string;
  stars: number;
  hp?: number;
  troopName?: string;
  troopImage?: string;
  pillTheme?: 'cyan' | 'amber' | 'purple' | 'emerald';
  image: string;
  badgeHighlight: string;
  lootWon: {
    stat1: { label: string; value: string; color: string };
    stat2: { label: string; value: string; color: string };
    stat3: { label: string; value: string; color: string };
  };
  tags: { name: string; color: string }[];
  demoUrl: string;
  sourceUrl: string;
}

export interface LabHonor {
  id: string;
  title: string;
  year: string;
  description: string;
  badge: string;
  color: 'primary' | 'secondary' | 'tertiary';
}

export interface DirectOutpost {
  name: string;
  handle: string;
  url: string;
  icon: string;
  color: string;
}

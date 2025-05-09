import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

import ChevronIcon from '../assets/chevron';

export const SidebarContainer = styled.div`
  display: ${p => (p.hidden ? 'none' : 'block')};
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  min-height: 100%;
  width: ${p => p.theme.layout.sidebar};

  @media ${({ theme }) => theme.media.sm} {
    display: block;
    position: relative;
    margin-left: calc(2 * ${p => p.theme.layout.stripes});
  }
`;

export const SideBarStripes = styled.div`
  border-left: ${p => p.theme.layout.stripes} solid #8196ff;
  border-right: ${p => p.theme.layout.stripes} solid #bcc6fa;
  position: absolute;
  height: 100%;
  width: 0;
  left: 0;
  top: 0;
  bottom: 0;
`;

export const SidebarWrapper = styled.aside`
  position: fixed;
  bottom: 0;
  top: ${p => p.theme.layout.header};
  -webkit-overflow-scrolling: touch;
  overflow-y: scroll;

  display: flex;
  flex-direction: column;
  z-index: 1;
  overflow-y: scroll;
  min-height: 100%;
  line-height: ${p => p.theme.lineHeights.body};
  font-size: ${p => p.theme.fontSizes.small};

  padding: ${p => p.theme.spacing.sm} ${p => p.theme.spacing.md};
  background-color: ${p => p.theme.colors.bg};
  border-right: 1px solid ${p => p.theme.colors.border};
  border-top: 1px solid ${p => p.theme.colors.border};
  width: ${p => p.theme.layout.sidebar};

  @media ${({ theme }) => theme.media.sm} {
    border: none;
    background: none;
    padding-top: ${p => p.theme.spacing.md};
  }
`;

export const SidebarNavItem = styled(NavLink).attrs(() => ({
  activeClassName: 'active',
}))`
  display: block;
  margin: ${p => p.theme.spacing.xs} 0;
  color: ${p => p.theme.colors.text};
  font-weight: ${p => p.theme.fontWeights.heading};
  text-decoration: none;
  width: 100%;

  &:hover {
    color: ${p => p.theme.colors.accent};
  }

  &.active {
    color: ${p => p.theme.colors.accent};
  }
`;

export const ChevronItem = styled(ChevronIcon).attrs(() => ({
  'aria-hidden': 'true',
}))`
  display: inline-block;
  color: inherit;
  vertical-align: baseline;
  margin-top: 0.08em;
  margin-left: 0.3em;
  padding: 0.08em;
  width: 1em;
  height: 1em;

  position: relative;
  top: 0.16em;

  ${SidebarNavItem}.active & {
    transform: rotate(180deg);
  }
`;

export const SidebarNavSubItemWrapper = styled.div`
  padding-left: ${p => p.theme.spacing.sm};
  margin-bottom: ${p => p.theme.spacing.xs};
`;

export const SidebarNavSubItem = styled(NavLink).attrs(() => ({}))`
  display: block;
  color: ${p => p.theme.colors.passive};
  font-weight: ${p => p.theme.fontWeights.body};
  text-decoration: none;
  margin: ${p =>
    `${p.theme.spacing.xs} 0 0 ${p.nested ? p.theme.spacing.sm : 0}`};

  &:first-child {
    margin-top: 0;
  }

  &:hover {
    color: ${p => p.theme.colors.accent};
  }

  &.active {
    color: ${p => p.theme.colors.accent};
    font-weight: ${p => p.theme.fontWeights.heading};
  }
`;
